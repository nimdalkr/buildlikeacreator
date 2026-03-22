import type {
  Category,
  Collection,
  Creator,
  DiscoveryTier,
  Project,
  ProjectSourceKind,
  ProjectStatus,
  SearchResult
} from "@/lib/types";
import {
  bulkCategoryNarratives,
  bulkCategoryQueries,
  categories,
  curatedCollections,
  curatedRepoSources,
  type BulkCategoryQuery,
  type CuratedRepoSource,
  type ImportedRepoSource
} from "@/lib/curated-github-sources";
import {
  appendCatalogSnapshot,
  readCatalogCache,
  readCatalogHarvestState,
  readCatalogSnapshots,
  readImportedRepos,
  writeCatalogCache,
  writeCatalogHarvestState
} from "@/lib/catalog-store";
import {
  fetchGitHubRepository,
  searchGitHubRepositories,
  type GitHubRepoSnapshot,
  type GitHubSearchRepositoryItem
} from "@/lib/github";
import * as mockCatalog from "@/lib/mock-data";
import { deriveProjectCurationMetadata } from "@/lib/project-curation";

type CatalogData = {
  categories: Category[];
  collections: Collection[];
  creators: Creator[];
  indexedProjects: Project[];
  publicProjects: Project[];
  curatedProjects: Project[];
  stats: CatalogStats;
};

type CatalogStats = {
  indexedProjectCount: number;
  qualifiedProjectCount: number;
  curatedProjectCount: number;
  publicCreatorCount: number;
  indexedCreatorCount: number;
  lastSnapshotAt?: string;
  snapshotCount?: number;
};

type CatalogProjectDraft = Omit<Project, "creatorId"> & {
  creatorGithubLogin: string;
  sourceKind: ProjectSourceKind;
  discoveryTier: DiscoveryTier;
  qualificationScore: number;
};

const CACHE_TTL_MS = Number(process.env.GITHUB_CATALOG_CACHE_MINUTES ?? "30") * 60 * 1000;
const BULK_PAGES_PER_QUERY = Number(process.env.GITHUB_BULK_PAGES_PER_QUERY ?? "1");
const BULK_RESULTS_PER_PAGE = Number(process.env.GITHUB_BULK_RESULTS_PER_PAGE ?? "100");
const BULK_QUERY_BATCH_SIZE = Number(
  process.env.GITHUB_BULK_QUERY_BATCH_SIZE ?? (process.env.GITHUB_TOKEN ? "32" : "10")
);
const BULK_QUERY_BATCH_ROUNDS = Number(
  process.env.GITHUB_BULK_QUERY_BATCH_ROUNDS ?? (process.env.GITHUB_TOKEN ? "3" : "1")
);
const MIN_QUALIFICATION_SCORE = Number(process.env.GITHUB_QUALIFICATION_SCORE_MIN ?? "7");
const MIN_QUALIFICATION_STARS = Number(process.env.GITHUB_QUALIFICATION_MIN_STARS ?? "30");
const MAX_QUALIFICATION_STALE_DAYS = Number(process.env.GITHUB_QUALIFICATION_MAX_STALE_DAYS ?? "540");
const IMPORT_QUALIFICATION_SCORE_MIN = Number(
  process.env.GITHUB_IMPORT_QUALIFICATION_SCORE_MIN ?? "4"
);
const LIMITED_STATUS_QUALIFICATION_SCORE_MIN = Number(
  process.env.GITHUB_LIMITED_QUALIFICATION_SCORE_MIN ?? "10"
);

let memoryCache: CatalogData | null = null;
let memoryCacheExpiresAt = 0;
let inflightCatalogPromise: Promise<CatalogData> | null = null;

function withProjectDefaults(project: Project): Project {
  return {
    ...project,
    subcategories: project.subcategories ?? [],
    audienceTags: project.audienceTags ?? [],
    useCaseTags: project.useCaseTags ?? [],
    formatTags: project.formatTags ?? [],
    difficulty: project.difficulty ?? "Intermediate",
    maintenanceTag: project.maintenanceTag ?? "Recently updated",
    licenseTag:
      project.licenseTag ?? (project.license && project.license !== "NOASSERTION" ? project.license : "Custom / Unknown"),
    badges: project.badges ?? [],
    recommendedFor: project.recommendedFor ?? "",
    strengths: project.strengths ?? [],
    caveats: project.caveats ?? [],
    installDifficulty: project.installDifficulty ?? "Moderate",
    productionReadiness: project.productionReadiness ?? "Great for learning"
  };
}

function isImportedSource(source: CuratedRepoSource | ImportedRepoSource): source is ImportedRepoSource {
  return "claimIntent" in source;
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatRelativeDate(input: string | null) {
  if (!input) {
    return "unknown";
  }

  const target = new Date(input);
  const diffInDays = Math.max(
    0,
    Math.floor((Date.now() - target.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (diffInDays === 0) {
    return "today";
  }

  if (diffInDays === 1) {
    return "1 day ago";
  }

  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  if (diffInDays < 365) {
    const months = Math.max(1, Math.floor(diffInDays / 30));
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.max(1, Math.floor(diffInDays / 365));
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function getStaleDays(input: string | null) {
  if (!input) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(0, Math.floor((Date.now() - new Date(input).getTime()) / (1000 * 60 * 60 * 24)));
}

function normalizeUrl(input?: string | null) {
  if (!input) {
    return undefined;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function hasReadmeDocsSignal(input?: string) {
  if (!input) {
    return false;
  }

  const normalized = input.toLowerCase();
  return (
    normalized.includes("#readme") ||
    normalized.includes("/docs") ||
    normalized.includes("docs.") ||
    normalized.includes("/documentation")
  );
}

function hasExternalDemoSignal(input?: string) {
  if (!input) {
    return false;
  }

  const normalized = input.toLowerCase();
  return !normalized.includes("github.com");
}

function looksThinSummary(summary: string) {
  const trimmed = summary.trim();
  return trimmed.length < 32 || /^mirror of\b/i.test(trimmed) || /^test\b/i.test(trimmed);
}

function looksSandboxyTitle(title: string) {
  return /(sandbox|playground|experiment|example|sample|demo)(-|$|\s)/i.test(title);
}

function calculateQualificationScore(project: {
  title: string;
  primaryCategory: string;
  githubStars?: number;
  githubForks?: number;
  updatedAt: string;
  demoUrl?: string;
  docsUrl?: string;
  license?: string;
  language: string;
  tags: string[];
  sourceKind: ProjectSourceKind;
  status: ProjectStatus;
  summary: string;
}) {
  if (project.sourceKind === "curated") {
    return 100;
  }

  if (project.status === "archived" || project.status === "removed") {
    return -100;
  }

  let score = project.sourceKind === "imported" ? 4 : 0;
  const stars = project.githubStars ?? 0;
  const forks = project.githubForks ?? 0;
  const staleDays = getStaleDays(project.updatedAt);
  const hasDocs = hasReadmeDocsSignal(project.docsUrl);
  const hasExternalDemo = hasExternalDemoSignal(project.demoUrl);
  const hasLicense = Boolean(project.license && project.license !== "NOASSERTION");
  const knownLanguage = Boolean(project.language && project.language !== "Unknown");
  const thinSummary = looksThinSummary(project.summary);
  const sandboxyTitle = looksSandboxyTitle(project.title);

  if (stars >= 50000) score += 10;
  else if (stars >= 10000) score += 8;
  else if (stars >= 2000) score += 6;
  else if (stars >= 500) score += 4;
  else if (stars >= 100) score += 2;
  else if (stars >= 30) score += 1;

  if (forks >= 5000) score += 5;
  else if (forks >= 1000) score += 4;
  else if (forks >= 200) score += 3;
  else if (forks >= 50) score += 2;
  else if (forks >= 10) score += 1;

  if (hasExternalDemo) score += 2;
  if (hasDocs) score += 2;
  if (hasLicense) score += 2;
  if (knownLanguage) score += 1;
  if (project.tags.length >= 3) score += 1;
  if (project.tags.length >= 5) score += 1;
  if (project.summary.trim().length >= 60) score += 1;
  if (project.status === "active" || project.status === "featured") score += 1;

  if (staleDays <= 30) score += 3;
  else if (staleDays <= 90) score += 2;
  else if (staleDays <= 180) score += 1;
  else if (staleDays > MAX_QUALIFICATION_STALE_DAYS) score -= 5;
  else if (staleDays > 365) score -= 3;
  else if (staleDays > 180) score -= 1;

  if (!hasLicense) score -= 2;
  if (!knownLanguage) score -= 1;
  if (!hasDocs && !hasExternalDemo) score -= 2;
  if (project.tags.length === 0) score -= 1;
  if (thinSummary) score -= 2;

  if (sandboxyTitle && stars < 200 && project.primaryCategory !== "templates-boilerplates") {
    score -= 3;
  }

  if (
    /(template|boilerplate|starter)/i.test(project.title) &&
    project.primaryCategory !== "templates-boilerplates" &&
    stars < 100
  ) {
    score -= 2;
  }

  return score;
}

function deriveDiscoveryTier(project: {
  sourceKind: ProjectSourceKind;
  status: ProjectStatus;
  githubStars?: number;
  qualificationScore: number;
  updatedAt: string;
}): DiscoveryTier {
  const staleDays = getStaleDays(project.updatedAt);

  if (project.sourceKind === "curated") {
    return "curated";
  }

  if (project.status === "archived" || project.status === "removed") {
    return "indexed";
  }

  if (project.sourceKind === "imported") {
    return project.qualificationScore >= IMPORT_QUALIFICATION_SCORE_MIN ? "qualified" : "indexed";
  }

  if (project.status === "limited") {
    return project.qualificationScore >= LIMITED_STATUS_QUALIFICATION_SCORE_MIN &&
      (project.githubStars ?? 0) >= Math.max(100, MIN_QUALIFICATION_STARS) &&
      staleDays <= MAX_QUALIFICATION_STALE_DAYS
      ? "qualified"
      : "indexed";
  }

  if (
    project.qualificationScore >= MIN_QUALIFICATION_SCORE &&
    (project.githubStars ?? 0) >= MIN_QUALIFICATION_STARS &&
    staleDays <= MAX_QUALIFICATION_STALE_DAYS
  ) {
    return "qualified";
  }

  return "indexed";
}

function deriveStatusFromSignals({
  archived,
  pushedAt,
  featured
}: {
  archived: boolean;
  pushedAt: string | null;
  featured?: boolean;
}): ProjectStatus {
  if (archived) {
    return "archived";
  }

  const pushedAtDate = pushedAt ? new Date(pushedAt) : null;
  const staleDays = pushedAtDate
    ? Math.floor((Date.now() - pushedAtDate.getTime()) / (1000 * 60 * 60 * 24))
    : Number.POSITIVE_INFINITY;

  if (staleDays > 365) {
    return "archived";
  }

  if (staleDays > 180) {
    return "limited";
  }

  if (featured) {
    return "featured";
  }

  return "active";
}

function derivePopularityScore(stars: number, forks: number, watchers: number) {
  return Math.round(Math.sqrt(Math.max(stars, 1)) * 8 + Math.sqrt(Math.max(forks, 1)) * 5 + Math.sqrt(Math.max(watchers, 1)) * 2);
}

function deriveProjectFromSnapshot(
  source: CuratedRepoSource | ImportedRepoSource,
  snapshot: GitHubRepoSnapshot
): CatalogProjectDraft {
  const [owner, repoName] = snapshot.repo.full_name.split("/");
  const sourceKind: ProjectSourceKind = isImportedSource(source) ? "imported" : "curated";
  const status = deriveStatusFromSignals({
    archived: snapshot.repo.archived,
    pushedAt: snapshot.repo.pushed_at,
    featured: "featured" in source ? source.featured : undefined
  });
  const githubUrl = snapshot.repo.html_url;
  const summary =
    snapshot.repo.description?.trim() ||
    `${snapshot.repo.full_name} is a public GitHub repository curated for builders.`;
  const longDescription = [
    summary,
    `${snapshot.repo.full_name} currently shows ${snapshot.repo.stargazers_count.toLocaleString()} GitHub stars and ${snapshot.repo.forks_count.toLocaleString()} forks.`,
    snapshot.repo.pushed_at
      ? `Recent code activity was pushed ${formatRelativeDate(snapshot.repo.pushed_at)}.`
      : "Recent code activity is unknown."
  ].join(" ");

  const tags = Array.from(
    new Set([...(source.tags ?? []), ...(snapshot.repo.topics ?? [])].filter(Boolean))
  ).slice(0, 6);

  const baseProject: CatalogProjectDraft = {
    id: `project-${slugify(snapshot.repo.full_name)}`,
    slug: slugify(`${owner}-${repoName}`),
    title: "title" in source && source.title ? source.title : repoName,
    summary,
    longDescription,
    contextualLabel: source.contextualLabel,
    contextualText: source.contextualText,
    status,
    statusLabel: status,
    claimed: isImportedSource(source) ? source.claimIntent === "creator" : Boolean(source.claimed),
    creatorGithubLogin: snapshot.owner.login.toLowerCase(),
    primaryCategory: source.primaryCategory,
    subcategories: [],
    tags,
    audienceTags: [],
    useCaseTags: [],
    formatTags: [],
    difficulty: "Intermediate",
    maintenanceTag: "Recently updated",
    licenseTag: "Custom / Unknown",
    badges: [],
    recommendedFor: "",
    strengths: [],
    caveats: [],
    installDifficulty: "Moderate",
    productionReadiness: "Great for learning",
    language: snapshot.repo.language ?? "Unknown",
    githubUrl,
    githubFullName: snapshot.repo.full_name,
    githubStars: snapshot.repo.stargazers_count,
    githubForks: snapshot.repo.forks_count,
    license: snapshot.repo.license?.spdx_id ?? snapshot.repo.license?.name ?? "NOASSERTION",
    demoUrl:
      "demoUrl" in source && source.demoUrl
        ? source.demoUrl
        : normalizeUrl(snapshot.repo.homepage),
    docsUrl:
      "docsUrl" in source && source.docsUrl
        ? source.docsUrl
        : normalizeUrl(snapshot.repo.homepage)?.includes("docs")
          ? normalizeUrl(snapshot.repo.homepage)
          : `${githubUrl}#readme`,
    updatedLabel: formatRelativeDate(snapshot.repo.pushed_at),
    updatedAt: snapshot.repo.pushed_at ?? snapshot.repo.updated_at ?? snapshot.fetchedAt,
    saves: derivePopularityScore(
      snapshot.repo.stargazers_count,
      snapshot.repo.forks_count,
      snapshot.repo.watchers_count
    ),
    likes: Math.max(
      12,
      Math.round(
        Math.sqrt(Math.max(snapshot.repo.stargazers_count, 1)) * 5 +
          Math.sqrt(Math.max(snapshot.repo.forks_count, 1)) * 3
      )
    ),
    featuredInCollectionSlugs:
      "featuredInCollectionSlugs" in source ? source.featuredInCollectionSlugs : [],
    sourceKind,
    discoveryTier: "indexed",
    qualificationScore: 0
  };

  const qualificationScore = calculateQualificationScore(baseProject);
  const curationMetadata = deriveProjectCurationMetadata({
    title: baseProject.title,
    summary: baseProject.summary,
    primaryCategory: baseProject.primaryCategory,
    tags: baseProject.tags,
    language: baseProject.language,
    githubStars: baseProject.githubStars,
    githubForks: baseProject.githubForks,
    demoUrl: baseProject.demoUrl,
    docsUrl: baseProject.docsUrl,
    license: baseProject.license,
    updatedAt: baseProject.updatedAt
  });
  return {
    ...baseProject,
    ...curationMetadata,
    qualificationScore,
    discoveryTier: deriveDiscoveryTier({
      sourceKind,
      status,
      githubStars: baseProject.githubStars,
      qualificationScore,
      updatedAt: baseProject.updatedAt
    })
  };
}

function deriveProjectFromBulkRepository(
  category: string,
  repository: GitHubSearchRepositoryItem
): CatalogProjectDraft {
  const [owner, repoName] = repository.full_name.split("/");
  const narrative = bulkCategoryNarratives[category] ?? bulkCategoryNarratives["developer-tools"];
  const githubUrl = repository.html_url;
  const summary =
    repository.description?.trim() ||
    `${repository.full_name} is a public GitHub repository discovered through category search.`;
  const status = deriveStatusFromSignals({
    archived: repository.archived,
    pushedAt: repository.pushed_at,
    featured: false
  });

  const baseProject: CatalogProjectDraft = {
    id: `project-${slugify(repository.full_name)}`,
    slug: slugify(`${owner}-${repoName}`),
    title: repoName,
    summary,
    longDescription: [
      summary,
      `${repository.full_name} currently shows ${repository.stargazers_count.toLocaleString()} GitHub stars and ${repository.forks_count.toLocaleString()} forks.`,
      repository.pushed_at
        ? `Recent code activity was pushed ${formatRelativeDate(repository.pushed_at)}.`
        : "Recent code activity is unknown."
    ].join(" "),
    contextualLabel: narrative.contextualLabel,
    contextualText: narrative.contextualText,
    status,
    statusLabel: status,
    claimed: false,
    creatorGithubLogin: repository.owner.login.toLowerCase(),
    primaryCategory: category,
    subcategories: [],
    tags: Array.from(new Set(repository.topics ?? [])).slice(0, 6),
    audienceTags: [],
    useCaseTags: [],
    formatTags: [],
    difficulty: "Intermediate",
    maintenanceTag: "Recently updated",
    licenseTag: "Custom / Unknown",
    badges: [],
    recommendedFor: "",
    strengths: [],
    caveats: [],
    installDifficulty: "Moderate",
    productionReadiness: "Great for learning",
    language: repository.language ?? "Unknown",
    githubUrl,
    githubFullName: repository.full_name,
    githubStars: repository.stargazers_count,
    githubForks: repository.forks_count,
    license: repository.license?.spdx_id ?? repository.license?.name ?? "NOASSERTION",
    demoUrl: normalizeUrl(repository.homepage),
    docsUrl: normalizeUrl(repository.homepage)?.includes("docs")
      ? normalizeUrl(repository.homepage)
      : `${githubUrl}#readme`,
    updatedLabel: formatRelativeDate(repository.pushed_at),
    updatedAt: repository.pushed_at ?? repository.updated_at ?? new Date().toISOString(),
    saves: derivePopularityScore(
      repository.stargazers_count,
      repository.forks_count,
      repository.watchers_count
    ),
    likes: Math.max(
      12,
      Math.round(
        Math.sqrt(Math.max(repository.stargazers_count, 1)) * 5 +
          Math.sqrt(Math.max(repository.forks_count, 1)) * 3
      )
    ),
    featuredInCollectionSlugs: [],
    sourceKind: "bulk",
    discoveryTier: "indexed",
    qualificationScore: 0
  };

  const qualificationScore = calculateQualificationScore(baseProject);
  const curationMetadata = deriveProjectCurationMetadata({
    title: baseProject.title,
    summary: baseProject.summary,
    primaryCategory: baseProject.primaryCategory,
    tags: baseProject.tags,
    language: baseProject.language,
    githubStars: baseProject.githubStars,
    githubForks: baseProject.githubForks,
    demoUrl: baseProject.demoUrl,
    docsUrl: baseProject.docsUrl,
    license: baseProject.license,
    updatedAt: baseProject.updatedAt
  });
  return {
    ...baseProject,
    ...curationMetadata,
    qualificationScore,
    discoveryTier: deriveDiscoveryTier({
      sourceKind: "bulk",
      status,
      githubStars: baseProject.githubStars,
      qualificationScore,
      updatedAt: baseProject.updatedAt
    })
  };
}

function buildFallbackCatalog(): CatalogData {
  const fallbackProjects = mockCatalog.projects.map((project) =>
    withProjectDefaults({
      ...project,
      sourceKind: "curated" as const,
      discoveryTier: "curated" as const,
      qualificationScore: 100
    } as Project)
  );
  return {
    categories: mockCatalog.categories,
    collections: mockCatalog.collections,
    creators: mockCatalog.creators,
    indexedProjects: fallbackProjects,
    publicProjects: fallbackProjects,
    curatedProjects: fallbackProjects,
    stats: {
      indexedProjectCount: fallbackProjects.length,
      qualifiedProjectCount: fallbackProjects.length,
      curatedProjectCount: fallbackProjects.length,
      publicCreatorCount: mockCatalog.creators.length,
      indexedCreatorCount: mockCatalog.creators.length
    }
  };
}

function getBulkQueryBatch(offset: number) {
  if (bulkCategoryQueries.length === 0) {
    return {
      queries: [] as BulkCategoryQuery[],
      nextOffset: 0
    };
  }

  const normalizedOffset = ((offset % bulkCategoryQueries.length) + bulkCategoryQueries.length) % bulkCategoryQueries.length;
  const batchSize = Math.min(BULK_QUERY_BATCH_SIZE, bulkCategoryQueries.length);
  const queries = Array.from({ length: batchSize }, (_, index) => {
    const cursor = (normalizedOffset + index) % bulkCategoryQueries.length;
    return bulkCategoryQueries[cursor];
  });

  return {
    queries,
    nextOffset: (normalizedOffset + batchSize) % bulkCategoryQueries.length
  };
}

function mergeCatalogProjects(
  currentProjects: CatalogProjectDraft[],
  previousCatalog?: CatalogData | null
) {
  const merged = new Map<string, CatalogProjectDraft>();
  const previousPublicCreatorIds = new Set((previousCatalog?.creators ?? []).map((creator) => creator.id));

  for (const project of previousCatalog?.indexedProjects ?? []) {
    if (!project.githubFullName || !previousPublicCreatorIds.has(project.creatorId)) {
      continue;
    }

    merged.set(project.githubFullName.toLowerCase(), {
      ...withProjectDefaults(project),
      creatorGithubLogin: project.githubFullName.split("/")[0].toLowerCase(),
      sourceKind: project.sourceKind ?? "bulk",
      discoveryTier: project.discoveryTier ?? "indexed",
      qualificationScore: project.qualificationScore ?? 0
    });
  }

  for (const project of currentProjects) {
    const key = project.githubFullName?.toLowerCase() ?? project.slug;
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, project);
      continue;
    }

    const existingUpdatedAt = Date.parse(existing.updatedAt);
    const nextUpdatedAt = Date.parse(project.updatedAt);
    const preferIncoming =
      project.discoveryTier === "curated" ||
      Number.isNaN(existingUpdatedAt) ||
      (!Number.isNaN(nextUpdatedAt) && nextUpdatedAt >= existingUpdatedAt);

    if (preferIncoming) {
      merged.set(key, {
        ...existing,
        ...project
      });
    }
  }

  return [...merged.values()];
}

async function fetchBulkRepositoriesByCategory(offset: number) {
  return fetchBulkRepositoriesByCategoryWithRounds(offset, Math.max(1, BULK_QUERY_BATCH_ROUNDS));
}

async function fetchBulkRepositoriesByCategoryWithRounds(offset: number, rounds: number) {
  let cursor = offset;
  const allSearchTasks: Array<{
    category: string;
    query: string;
    sort?: "stars" | "updated";
    order?: "desc" | "asc";
    page: number;
  }> = [];

  for (let round = 0; round < rounds; round += 1) {
    const { queries, nextOffset } = getBulkQueryBatch(cursor);
    cursor = nextOffset;

    for (const { category, query, sort, order } of queries) {
      for (let page = 1; page <= BULK_PAGES_PER_QUERY; page += 1) {
        allSearchTasks.push({
          category,
          query,
          sort,
          order,
          page
        });
      }
    }
  }

  const searchResults = await Promise.all(
    allSearchTasks.map(async ({ category, query, sort, order, page }) => {
      try {
        const result = await searchGitHubRepositories(
          query,
          page,
          BULK_RESULTS_PER_PAGE,
          sort ?? "stars",
          order ?? "desc"
        );
        return result.items.map((item) => ({
          category,
          item
        }));
      } catch {
        return [];
      }
    })
  );

  const deduped = new Map<string, { category: string; item: GitHubSearchRepositoryItem }>();
  for (const entry of searchResults.flat()) {
    const key = entry.item.full_name.toLowerCase();
    const existing = deduped.get(key);
    if (!existing || existing.item.stargazers_count < entry.item.stargazers_count) {
      deduped.set(key, entry);
    }
  }

  return {
    repositories: [...deduped.values()],
    nextOffset: cursor
  };
}

async function fetchCatalogFromGitHub(
  importedSources: ImportedRepoSource[],
  previousCatalog?: CatalogData | null,
  bulkQueryOffset = 0,
  roundCount = Math.max(1, BULK_QUERY_BATCH_ROUNDS)
): Promise<{ catalog: CatalogData; nextBulkQueryOffset: number }> {
  const allSources = [...curatedRepoSources, ...importedSources];
  const [snapshots, bulkResult] = await Promise.all([
    Promise.all(
    allSources.map(async (source) => {
      try {
        const snapshot = await fetchGitHubRepository(source.repoFullName);
        return { source, snapshot };
      } catch {
        return null;
      }
    })
    ),
    fetchBulkRepositoriesByCategoryWithRounds(bulkQueryOffset, roundCount)
  ]);
  const bulkRepositories = bulkResult.repositories;

  const liveEntries = snapshots.filter(
    (entry): entry is { source: CuratedRepoSource | ImportedRepoSource; snapshot: GitHubRepoSnapshot } =>
      Boolean(entry)
  );

  if (liveEntries.length === 0) {
    throw new Error("No GitHub repositories could be fetched");
  }

  const rawProjects = liveEntries.map(({ source, snapshot }) =>
    deriveProjectFromSnapshot(source, snapshot)
  );
  const bulkProjects = bulkRepositories.map(({ category, item }) =>
    deriveProjectFromBulkRepository(category, item)
  );

  const creatorMap = new Map<string, Creator>();

  for (const creator of previousCatalog?.creators ?? []) {
    creatorMap.set(creator.githubLogin.toLowerCase(), { ...creator, projectCount: 0 });
  }

  for (const { source, snapshot } of liveEntries) {
    const key = snapshot.owner.login.toLowerCase();
    const existing = creatorMap.get(key);
    if (!existing) {
      creatorMap.set(key, {
        id: `creator-${slugify(snapshot.owner.login)}`,
        slug: slugify(snapshot.owner.login),
        displayName: snapshot.owner.name || snapshot.owner.login,
        githubLogin: snapshot.owner.login,
        bio:
          snapshot.owner.bio ||
          `${snapshot.owner.login} builds public tools and repositories that are worth discovering beyond raw GitHub listings.`,
        avatarUrl: snapshot.owner.avatar_url,
        websiteUrl: normalizeUrl(snapshot.owner.blog) || snapshot.owner.html_url,
        specialties: Array.from(
          new Set(
            allSources
              .filter((candidate) => candidate.repoFullName.split("/")[0].toLowerCase() === key)
              .flatMap((candidate) => candidate.tags ?? [])
          )
        ).slice(0, 4),
        projectCount: 0,
        followers: snapshot.owner.followers,
        claimed: isImportedSource(source) ? source.claimIntent === "creator" : Boolean(source.claimed)
      });
    }
  }

  for (const { category, item } of bulkRepositories) {
    const key = item.owner.login.toLowerCase();
    const existing = creatorMap.get(key);
    const specialtyPool = Array.from(new Set([category, ...(item.topics ?? [])])).slice(0, 4);

    if (!existing) {
      creatorMap.set(key, {
        id: `creator-${slugify(item.owner.login)}`,
        slug: slugify(item.owner.login),
        displayName: item.owner.login,
        githubLogin: item.owner.login,
        bio: `${item.owner.login} publishes public repositories discovered through GitHub category search.`,
        avatarUrl: item.owner.avatar_url,
        websiteUrl: item.owner.html_url,
        specialties: specialtyPool,
        projectCount: 0,
        followers: Math.round(Math.sqrt(Math.max(item.stargazers_count, 1)) * 18),
        claimed: false
      });
      continue;
    }

    existing.specialties = Array.from(new Set([...existing.specialties, ...specialtyPool])).slice(0, 4);
    existing.followers = Math.max(
      existing.followers,
      Math.round(Math.sqrt(Math.max(item.stargazers_count, 1)) * 18)
    );
  }

  const mergedProjectDrafts = mergeCatalogProjects([...rawProjects, ...bulkProjects], previousCatalog);

  const indexedProjects = mergedProjectDrafts.map((project) => {
    const { creatorGithubLogin, ...projectData } = project;
    const creator = creatorMap.get(project.creatorGithubLogin);
    if (!creator) {
      throw new Error(`Creator not found for ${project.githubFullName}`);
    }

    creator.projectCount += 1;

    return {
      ...projectData,
      creatorId: creator.id
    } satisfies Project;
  });

  const sortedIndexedProjects = indexedProjects.sort((left, right) => {
    if (left.discoveryTier === "curated" && right.discoveryTier !== "curated") {
      return -1;
    }

    if (left.discoveryTier !== "curated" && right.discoveryTier === "curated") {
      return 1;
    }

    return (right.githubStars ?? 0) - (left.githubStars ?? 0);
  });

  const publicProjects = sortedIndexedProjects.filter(
    (project) => project.discoveryTier === "qualified" || project.discoveryTier === "curated"
  );
  const curatedProjects = sortedIndexedProjects.filter(
    (project) => project.discoveryTier === "curated"
  );
  const publicCreatorIds = new Set(publicProjects.map((project) => project.creatorId));
  const publicProjectCounts = new Map<string, number>();
  for (const project of publicProjects) {
    publicProjectCounts.set(project.creatorId, (publicProjectCounts.get(project.creatorId) ?? 0) + 1);
  }

  const publicCreators = [...creatorMap.values()]
    .filter((creator) => publicCreatorIds.has(creator.id))
    .map((creator) => ({
      ...creator,
      projectCount: publicProjectCounts.get(creator.id) ?? 0
    }))
    .sort((left, right) => right.followers - left.followers);

  const collections: Collection[] = curatedCollections
    .map((collection) => ({
      id: collection.id,
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      editorName: collection.editorName,
      tags: collection.tags,
      projectSlugs: collection.repoFullNames.flatMap((repoFullName) => {
        const project = curatedProjects.find(
          (entry) => entry.githubFullName?.toLowerCase() === repoFullName.toLowerCase()
        );
        return project ? [project.slug] : [];
      })
    }))
    .filter((collection) => collection.projectSlugs.length > 0);

  const catalog: CatalogData = {
    categories,
    creators: publicCreators,
    indexedProjects: sortedIndexedProjects,
    publicProjects,
    curatedProjects,
    collections,
    stats: {
      indexedProjectCount: sortedIndexedProjects.length,
      qualifiedProjectCount: publicProjects.length,
      curatedProjectCount: curatedProjects.length,
      publicCreatorCount: publicCreators.length,
      indexedCreatorCount: creatorMap.size
    }
  };

  return {
    catalog,
    nextBulkQueryOffset: bulkResult.nextOffset
  };
}

async function loadCatalogInternal(forceRefresh = false): Promise<CatalogData> {
  const now = Date.now();
  if (!forceRefresh && memoryCache && memoryCacheExpiresAt > now) {
    return memoryCache;
  }

  if (!forceRefresh && inflightCatalogPromise) {
    return inflightCatalogPromise;
  }

  inflightCatalogPromise = (async () => {
    const cached = await readCatalogCache<CatalogData>();
    if (
      !forceRefresh &&
      cached &&
      Date.now() - new Date(cached.generatedAt).getTime() < CACHE_TTL_MS &&
      cached.data.categories.length >= categories.length
    ) {
      memoryCache = {
        ...cached.data,
        indexedProjects: cached.data.indexedProjects.map(withProjectDefaults),
        publicProjects: cached.data.publicProjects.map(withProjectDefaults),
        curatedProjects: cached.data.curatedProjects.map(withProjectDefaults)
      };
      memoryCacheExpiresAt = now + CACHE_TTL_MS;
      return memoryCache;
    }

    const importedSources = await readImportedRepos();
    const harvestState = await readCatalogHarvestState();

    try {
      const { catalog: liveCatalog, nextBulkQueryOffset } = await fetchCatalogFromGitHub(
        importedSources,
        cached?.data ?? null,
        harvestState.bulkQueryOffset,
        Math.max(1, BULK_QUERY_BATCH_ROUNDS)
      );
      await writeCatalogCache(liveCatalog);
      await writeCatalogHarvestState({
        bulkQueryOffset: nextBulkQueryOffset,
        lastRunAt: new Date().toISOString(),
        lastSnapshotAt: harvestState.lastSnapshotAt,
        lastFullHarvestAt: harvestState.lastFullHarvestAt,
        snapshotCount: harvestState.snapshotCount ?? 0
      });
      memoryCache = liveCatalog;
      memoryCacheExpiresAt = Date.now() + CACHE_TTL_MS;
      return liveCatalog;
    } catch {
      if (cached?.data) {
        memoryCache = cached.data;
        memoryCacheExpiresAt = Date.now() + CACHE_TTL_MS;
        return cached.data;
      }

      const fallback = buildFallbackCatalog();
      memoryCache = fallback;
      memoryCacheExpiresAt = Date.now() + 5 * 60 * 1000;
      return fallback;
    } finally {
      inflightCatalogPromise = null;
    }
  })();

  return inflightCatalogPromise!;
}

export async function invalidateCatalogCache() {
  memoryCache = null;
  memoryCacheExpiresAt = 0;
  inflightCatalogPromise = null;
}

export async function refreshCatalog() {
  return loadCatalogInternal(true);
}

export async function createCatalogSnapshot(mode: "daily" | "bootstrap" = "daily") {
  const cached = await readCatalogCache<CatalogData>();
  const importedSources = await readImportedRepos();
  const previousCatalog = cached?.data ?? null;
  const totalRounds = Math.max(1, Math.ceil(bulkCategoryQueries.length / BULK_QUERY_BATCH_SIZE));
  const { catalog } = await fetchCatalogFromGitHub(importedSources, previousCatalog, 0, totalRounds);
  const generatedAt = new Date().toISOString();
  const harvestState = await readCatalogHarvestState();

  await writeCatalogCache(catalog);
  await appendCatalogSnapshot({
    id: `snapshot-${generatedAt}`,
    mode,
    generatedAt,
    indexedProjectCount: catalog.stats.indexedProjectCount,
    qualifiedProjectCount: catalog.stats.qualifiedProjectCount,
    curatedProjectCount: catalog.stats.curatedProjectCount,
    publicCreatorCount: catalog.stats.publicCreatorCount
  });
  await writeCatalogHarvestState({
    bulkQueryOffset: 0,
    lastRunAt: generatedAt,
    lastSnapshotAt: generatedAt,
    lastFullHarvestAt: generatedAt,
    snapshotCount: (harvestState.snapshotCount ?? 0) + 1
  });

  memoryCache = {
    ...catalog,
    stats: {
      ...catalog.stats,
      lastSnapshotAt: generatedAt,
      snapshotCount: (harvestState.snapshotCount ?? 0) + 1
    }
  };
  memoryCacheExpiresAt = Date.now() + CACHE_TTL_MS;
  inflightCatalogPromise = null;
  return memoryCache;
}

export { categories };

export async function getCollections() {
  return (await loadCatalogInternal()).collections;
}

export async function getCreators() {
  return (await loadCatalogInternal()).creators;
}

export async function getCatalogStats() {
  const catalog = await loadCatalogInternal();
  const harvestState = await readCatalogHarvestState();
  const snapshots = await readCatalogSnapshots();

  return {
    ...catalog.stats,
    lastSnapshotAt: harvestState.lastSnapshotAt ?? snapshots[0]?.generatedAt,
    snapshotCount: harvestState.snapshotCount ?? snapshots.length
  };
}

export async function getIndexedProjects() {
  return (await loadCatalogInternal()).indexedProjects;
}

export async function getProjects() {
  return (await loadCatalogInternal()).publicProjects;
}

export async function getCuratedProjects() {
  return (await loadCatalogInternal()).curatedProjects;
}

export async function getCreatorById(creatorId: string) {
  return (await getCreators()).find((creator) => creator.id === creatorId);
}

export async function getCreatorBySlug(slug: string) {
  return (await getCreators()).find((creator) => creator.slug === slug);
}

export async function getProjectBySlug(slug: string) {
  return (await getProjects()).find((project) => project.slug === slug);
}

export async function getCollectionBySlug(slug: string) {
  return (await getCollections()).find((collection) => collection.slug === slug);
}

export async function getProjectsForCreator(creatorId: string) {
  return (await getProjects()).filter((project) => project.creatorId === creatorId);
}

export async function getProjectsForCollection(collectionSlug: string) {
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection) {
    return [];
  }

  const projects = await getProjects();
  return projects.filter((project) => collection.projectSlugs.includes(project.slug));
}

export async function getFeaturedProjects() {
  return (await getCuratedProjects()).filter((project) => project.status === "featured");
}

export async function getTrendingProjects() {
  return [...(await getProjects())].sort((left, right) => {
    const rightScore = (right.githubStars ?? 0) + right.saves + right.likes;
    const leftScore = (left.githubStars ?? 0) + left.saves + left.likes;
    return rightScore - leftScore;
  });
}

export async function getProjectsByCategory(categorySlug?: string, sort = "trending") {
  const projects = await getProjects();
  const filtered = categorySlug
    ? projects.filter((project) => project.primaryCategory === categorySlug)
    : projects;

  if (sort === "newest") {
    return [...filtered].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  if (sort === "most-saved") {
    return [...filtered].sort((left, right) => right.saves - left.saves);
  }

  return [...filtered].sort((left, right) => {
    const leftBoost = left.status === "featured" ? 1 : 0;
    const rightBoost = right.status === "featured" ? 1 : 0;
    if (leftBoost !== rightBoost) {
      return rightBoost - leftBoost;
    }

    return (right.githubStars ?? 0) - (left.githubStars ?? 0);
  });
}

export async function getSearchResults(query: string): Promise<SearchResult[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const [projects, creators, collections] = await Promise.all([
    getProjects(),
    getCreators(),
    getCollections()
  ]);

  const projectResults = projects
    .filter((project) =>
      [
        project.title,
        project.summary,
        project.contextualText,
        project.primaryCategory,
        ...(project.subcategories ?? []),
        project.githubFullName,
        ...(project.tags ?? []),
        ...(project.badges ?? []),
        ...(project.audienceTags ?? []),
        ...(project.useCaseTags ?? [])
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
    .map((project) => ({
      kind: "project" as const,
      title: project.title,
      slug: project.slug,
      description: project.summary
    }));

  const creatorResults = creators
    .filter((creator) =>
      [creator.displayName, creator.githubLogin, creator.bio, ...creator.specialties]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
    .map((creator) => ({
      kind: "creator" as const,
      title: creator.displayName,
      slug: creator.slug,
      description: creator.bio
    }));

  const collectionResults = collections
    .filter((collection) =>
      [collection.title, collection.description, ...collection.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
    .map((collection) => ({
      kind: "collection" as const,
      title: collection.title,
      slug: collection.slug,
      description: collection.description
    }));

  return [...projectResults, ...creatorResults, ...collectionResults];
}
