import { categories, getCreators, getCuratedProjects, getProjects } from "@/lib/catalog";
import { inferPrimaryCategoryFromSignals } from "@/lib/category-inference";
import {
  fetchGitHubRepositoryDeepSignals,
  fetchGitHubViewerPinnedRepositories,
  fetchGitHubViewerRepositories,
  fetchGitHubViewerStarredRepositories,
  type GitHubRepoDeepSignals,
  type GitHubViewerRepository
} from "@/lib/github";
import { deriveProjectCurationMetadata } from "@/lib/project-curation";
import type { Creator, Project, UserInterestConfidence, UserInterestProfile } from "@/lib/types";

type ScoredProject = {
  project: Project;
  score: number;
};

type PersonalizedHomeData = {
  profile: UserInterestProfile;
  recommendedProjects: Project[];
  recommendedCreators: Creator[];
  allCreators: Creator[];
  fallbackProjects: Project[];
  fallbackMode: "repo-profile" | "manual-interests" | "editorial-fallback";
};

type RepositorySignalSource = "owned" | "starred" | "pinned";

type RepositorySignal = {
  repo: GitHubViewerRepository;
  sources: Set<RepositorySignalSource>;
  deepSignals?: GitHubRepoDeepSignals;
};

type SyncInterestProfileResult = {
  profile: UserInterestProfile;
  repositories: GitHubViewerRepository[];
};

function takeTopEntries(scoreMap: Map<string, number>, limit: number) {
  return [...scoreMap.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([value]) => value);
}

function normalizeKeywordTag(input: string) {
  return input.trim();
}

function getRepositorySignalWeight(signal: RepositorySignal) {
  let weight = 1;
  const repo = signal.repo;

  if (signal.sources.has("owned")) {
    weight += 4;
  }

  if (signal.sources.has("starred")) {
    weight += 3;
  }

  if (signal.sources.has("pinned")) {
    weight += 5;
  }

  if (!repo.fork) {
    weight += 1;
  }

  if (repo.private) {
    weight += 1;
  }

  if (repo.stargazers_count >= 1000) {
    weight += 2;
  } else if (repo.stargazers_count >= 100) {
    weight += 1;
  }

  if (repo.pushed_at) {
    const staleDays = Math.max(
      0,
      Math.floor((Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24))
    );

    if (staleDays <= 30) {
      weight += 2;
    } else if (staleDays <= 120) {
      weight += 1;
    }
  }

  if (signal.deepSignals?.readmePreview) {
    weight += 2;
  }

  if ((signal.deepSignals?.representativeFiles.length ?? 0) >= 2) {
    weight += 1;
  }

  return weight;
}

function getConfidence(profile: {
  ownedRepoCount: number;
  starredRepoCount: number;
  pinnedRepoCount: number;
  analyzedRepoCount: number;
  deepAnalyzedRepoCount: number;
}): {
  confidence: UserInterestConfidence;
  confidenceScore: number;
} {
  const score = Math.max(
    0,
    Math.min(
      100,
      profile.analyzedRepoCount * 9 +
        profile.deepAnalyzedRepoCount * 6 +
        Math.min(profile.starredRepoCount, 30) +
        Math.min(profile.pinnedRepoCount * 4, 16)
    )
  );

  if (score >= 72) {
    return { confidence: "high", confidenceScore: score };
  }

  if (score >= 38) {
    return { confidence: "medium", confidenceScore: score };
  }

  return { confidence: "low", confidenceScore: score };
}

function mergeRepositorySignals(
  ownedRepositories: GitHubViewerRepository[],
  starredRepositories: GitHubViewerRepository[],
  pinnedRepositories: GitHubViewerRepository[]
) {
  const signalMap = new Map<string, RepositorySignal>();

  for (const [source, repositories] of [
    ["owned", ownedRepositories],
    ["starred", starredRepositories],
    ["pinned", pinnedRepositories]
  ] as const) {
    for (const repo of repositories) {
      const key = repo.full_name.toLowerCase();
      const existing = signalMap.get(key);
      if (existing) {
        existing.sources.add(source);
      } else {
        signalMap.set(key, {
          repo,
          sources: new Set([source])
        });
      }
    }
  }

  return [...signalMap.values()];
}

function buildDeepAnalysisText(signal: RepositorySignal) {
  return [
    signal.repo.name,
    signal.repo.description ?? "",
    ...(signal.repo.topics ?? []),
    signal.deepSignals?.readmePreview ?? "",
    ...(signal.deepSignals?.detectedKeywords ?? []),
    ...(signal.deepSignals?.representativeFiles ?? [])
  ].join(" ");
}

function deriveInterestProfileFromSignals(
  repositorySignals: RepositorySignal[],
  manualInterests: string[],
  counts: {
    ownedRepoCount: number;
    starredRepoCount: number;
    pinnedRepoCount: number;
  }
): UserInterestProfile {
  const eligibleSignals = repositorySignals.filter((signal) => !signal.repo.archived);
  const categoryScores = new Map<string, number>();
  const subcategoryScores = new Map<string, number>();
  const tagScores = new Map<string, number>();
  const languageScores = new Map<string, number>();
  const topSignalScores = new Map<string, number>();

  for (const signal of eligibleSignals) {
    const repo = signal.repo;
    const topicPool = [
      ...(repo.topics ?? []),
      ...(signal.deepSignals?.detectedKeywords ?? []).map(normalizeKeywordTag)
    ];
    const primaryCategory = inferPrimaryCategoryFromSignals(
      topicPool,
      repo.language,
      buildDeepAnalysisText(signal)
    );
    const curation = deriveProjectCurationMetadata({
      title: repo.name,
      summary: `${repo.description ?? repo.full_name} ${signal.deepSignals?.readmePreview ?? ""}`.trim(),
      primaryCategory,
      tags: topicPool,
      language: repo.language ?? "Unknown",
      githubStars: repo.stargazers_count,
      githubForks: repo.forks_count,
      demoUrl: repo.homepage ?? undefined,
      docsUrl: signal.deepSignals?.readmePreview ? repo.html_url : repo.homepage ?? undefined,
      license: repo.license?.spdx_id ?? repo.license?.name ?? "NOASSERTION",
      updatedAt: repo.pushed_at ?? repo.updated_at ?? new Date().toISOString()
    });
    const weight = getRepositorySignalWeight(signal);

    categoryScores.set(primaryCategory, (categoryScores.get(primaryCategory) ?? 0) + weight);

    for (const subcategory of curation.subcategories) {
      subcategoryScores.set(subcategory, (subcategoryScores.get(subcategory) ?? 0) + weight);
    }

    for (const tag of [
      ...topicPool,
      ...curation.useCaseTags,
      ...curation.formatTags,
      ...curation.audienceTags
    ]) {
      const normalizedTag = normalizeKeywordTag(tag);
      if (!normalizedTag) {
        continue;
      }

      tagScores.set(normalizedTag, (tagScores.get(normalizedTag) ?? 0) + weight);
    }

    if (repo.language) {
      languageScores.set(repo.language, (languageScores.get(repo.language) ?? 0) + weight);
    }

    for (const keyword of signal.deepSignals?.detectedKeywords ?? []) {
      topSignalScores.set(keyword, (topSignalScores.get(keyword) ?? 0) + weight);
    }

    for (const source of signal.sources) {
      const sourceLabel =
        source === "owned" ? "Own repos" : source === "starred" ? "Starred repos" : "Pinned repos";
      topSignalScores.set(sourceLabel, (topSignalScores.get(sourceLabel) ?? 0) + weight);
    }
  }

  for (const manualInterest of manualInterests) {
    categoryScores.set(manualInterest, (categoryScores.get(manualInterest) ?? 0) + 6);
  }

  const deepAnalyzedRepoCount = eligibleSignals.filter((signal) => signal.deepSignals).length;
  const { confidence, confidenceScore } = getConfidence({
    ownedRepoCount: counts.ownedRepoCount,
    starredRepoCount: counts.starredRepoCount,
    pinnedRepoCount: counts.pinnedRepoCount,
    analyzedRepoCount: eligibleSignals.length,
    deepAnalyzedRepoCount
  });

  return {
    repoCount: repositorySignals.length,
    analyzedRepoCount: eligibleSignals.length,
    ownedRepoCount: counts.ownedRepoCount,
    starredRepoCount: counts.starredRepoCount,
    pinnedRepoCount: counts.pinnedRepoCount,
    deepAnalyzedRepoCount,
    confidence,
    confidenceScore,
    topCategories: takeTopEntries(categoryScores, 4),
    topSubcategories: takeTopEntries(subcategoryScores, 6),
    topTags: takeTopEntries(tagScores, 10),
    topLanguages: takeTopEntries(languageScores, 5),
    topSignals: takeTopEntries(topSignalScores, 6),
    manualInterests,
    lastAnalyzedAt: new Date().toISOString()
  };
}

function scoreProjectForProfile(
  project: Project,
  profile: UserInterestProfile,
  viewerGithubLogin?: string
) {
  if (viewerGithubLogin && project.githubFullName?.toLowerCase().startsWith(`${viewerGithubLogin.toLowerCase()}/`)) {
    return -1;
  }

  let score = 0;
  const categoryIndex = profile.topCategories.indexOf(project.primaryCategory);
  if (categoryIndex >= 0) {
    score += Math.max(22 - categoryIndex * 4, 8);
  }

  const matchingSubcategories = project.subcategories.filter((subcategory) =>
    profile.topSubcategories.includes(subcategory)
  ).length;
  score += matchingSubcategories * 5;

  const projectTagPool = new Set([
    ...project.tags,
    ...project.useCaseTags,
    ...project.formatTags,
    ...project.audienceTags,
    project.language
  ]);

  for (const tag of profile.topTags) {
    if (projectTagPool.has(tag)) {
      score += 3;
    }
  }

  for (const signal of profile.topSignals) {
    if (projectTagPool.has(signal) || project.summary.toLowerCase().includes(signal.toLowerCase())) {
      score += 2;
    }
  }

  for (const language of profile.topLanguages) {
    if (project.language === language) {
      score += 5;
    }
  }

  for (const manualInterest of profile.manualInterests) {
    if (project.primaryCategory === manualInterest) {
      score += 6;
    }
  }

  if (project.discoveryTier === "curated") {
    score += 5;
  }

  if (project.status === "featured") {
    score += 3;
  }

  score += Math.min(project.githubStars ?? 0, 50000) / 2500;
  return score;
}

export async function buildPersonalizedHomeData(options: {
  profile: UserInterestProfile;
  viewerGithubLogin?: string;
}): Promise<PersonalizedHomeData> {
  const [projects, creators, curatedProjects] = await Promise.all([
    getProjects(),
    getCreators(),
    getCuratedProjects()
  ]);

  const scoredProjects: ScoredProject[] = projects
    .map((project) => ({
      project,
      score: scoreProjectForProfile(project, options.profile, options.viewerGithubLogin)
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  const fallbackProjects = curatedProjects.slice(0, 5);
  const visibleProjects =
    scoredProjects.length > 0 ? scoredProjects.slice(0, 15).map((entry) => entry.project) : curatedProjects.slice(0, 10);
  const recommendedCreators = [...new Set(visibleProjects.map((project) => project.creatorId))]
    .map((creatorId) => creators.find((creator) => creator.id === creatorId))
    .filter((creator): creator is Creator => Boolean(creator))
    .filter((creator) => creator.githubLogin.toLowerCase() !== options.viewerGithubLogin?.toLowerCase())
    .slice(0, 5);

  let fallbackMode: PersonalizedHomeData["fallbackMode"] = "repo-profile";
  if (options.profile.manualInterests.length > 0 && options.profile.confidence === "low") {
    fallbackMode = "manual-interests";
  } else if (scoredProjects.length === 0) {
    fallbackMode = "editorial-fallback";
  }

  return {
    profile: options.profile,
    recommendedProjects: visibleProjects,
    recommendedCreators,
    allCreators: creators,
    fallbackProjects,
    fallbackMode
  };
}

export async function syncInterestProfileFromGitHub(options: {
  accessToken: string;
  manualInterests?: string[];
}): Promise<SyncInterestProfileResult> {
  const [ownedRepositories, starredRepositories, pinnedRepositories] = await Promise.all([
    fetchGitHubViewerRepositories(options.accessToken),
    fetchGitHubViewerStarredRepositories(options.accessToken).catch(() => []),
    fetchGitHubViewerPinnedRepositories(options.accessToken).catch(() => [])
  ]);
  const repositorySignals = mergeRepositorySignals(
    ownedRepositories,
    starredRepositories,
    pinnedRepositories
  );
  const deepAnalysisTargets = repositorySignals
    .slice()
    .sort((left, right) => getRepositorySignalWeight(right) - getRepositorySignalWeight(left))
    .slice(0, Number(process.env.GITHUB_DEEP_ANALYSIS_REPOS ?? "10"));

  const deepSignalEntries = await Promise.all(
    deepAnalysisTargets.map(async (signal) => {
      try {
        const deepSignals = await fetchGitHubRepositoryDeepSignals(signal.repo.full_name, options.accessToken);
        return [signal.repo.full_name.toLowerCase(), deepSignals] as const;
      } catch {
        return null;
      }
    })
  );
  const deepSignalMap = new Map(
    deepSignalEntries.filter((entry): entry is readonly [string, GitHubRepoDeepSignals] => Boolean(entry))
  );

  for (const signal of repositorySignals) {
    signal.deepSignals = deepSignalMap.get(signal.repo.full_name.toLowerCase());
  }

  const profile = deriveInterestProfileFromSignals(repositorySignals, options.manualInterests ?? [], {
    ownedRepoCount: ownedRepositories.length,
    starredRepoCount: starredRepositories.length,
    pinnedRepoCount: pinnedRepositories.length
  });

  return {
    profile,
    repositories: repositorySignals.map((signal) => signal.repo)
  };
}

export function getSuggestedInterestCategories() {
  return categories.map((category) => ({
    slug: category.slug,
    name: category.name
  }));
}
