import { categories, getCreators, getCuratedProjects, getProjects } from "@/lib/catalog";
import { inferPrimaryCategoryFromSignals } from "@/lib/category-inference";
import { fetchGitHubViewerRepositories, type GitHubViewerRepository } from "@/lib/github";
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

function takeTopEntries(scoreMap: Map<string, number>, limit: number) {
  return [...scoreMap.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([value]) => value);
}

function getRepoWeight(repo: GitHubViewerRepository) {
  let weight = 1;

  if (!repo.fork) {
    weight += 1;
  }

  if (repo.private) {
    weight += 1;
  }

  if (repo.stargazers_count >= 100) {
    weight += 2;
  } else if (repo.stargazers_count >= 20) {
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

  return weight;
}

function getConfidence(repoCount: number, analyzedRepoCount: number): {
  confidence: UserInterestConfidence;
  confidenceScore: number;
} {
  const score = Math.max(0, Math.min(100, analyzedRepoCount * 16 + Math.min(repoCount, 10) * 4));

  if (score >= 70) {
    return { confidence: "high", confidenceScore: score };
  }

  if (score >= 35) {
    return { confidence: "medium", confidenceScore: score };
  }

  return { confidence: "low", confidenceScore: score };
}

export function deriveInterestProfileFromRepositories(
  repositories: GitHubViewerRepository[],
  manualInterests: string[] = []
): UserInterestProfile {
  const eligibleRepos = repositories.filter((repo) => !repo.archived && !repo.fork);
  const categoryScores = new Map<string, number>();
  const subcategoryScores = new Map<string, number>();
  const tagScores = new Map<string, number>();
  const languageScores = new Map<string, number>();

  for (const repo of eligibleRepos) {
    const topicPool = repo.topics ?? [];
    const primaryCategory = inferPrimaryCategoryFromSignals(
      topicPool,
      repo.language,
      `${repo.name} ${repo.description ?? ""}`
    );
    const curation = deriveProjectCurationMetadata({
      title: repo.name,
      summary: repo.description ?? repo.full_name,
      primaryCategory,
      tags: topicPool,
      language: repo.language ?? "Unknown",
      githubStars: repo.stargazers_count,
      githubForks: repo.forks_count,
      demoUrl: repo.homepage ?? undefined,
      docsUrl: repo.homepage ?? undefined,
      license: repo.license?.spdx_id ?? repo.license?.name ?? "NOASSERTION",
      updatedAt: repo.pushed_at ?? repo.updated_at ?? new Date().toISOString()
    });
    const weight = getRepoWeight(repo);

    categoryScores.set(primaryCategory, (categoryScores.get(primaryCategory) ?? 0) + weight);

    for (const subcategory of curation.subcategories) {
      subcategoryScores.set(subcategory, (subcategoryScores.get(subcategory) ?? 0) + weight);
    }

    for (const tag of [...topicPool, ...curation.useCaseTags, ...curation.formatTags]) {
      const normalizedTag = tag.trim();
      if (!normalizedTag) {
        continue;
      }

      tagScores.set(normalizedTag, (tagScores.get(normalizedTag) ?? 0) + weight);
    }

    if (repo.language) {
      languageScores.set(repo.language, (languageScores.get(repo.language) ?? 0) + weight);
    }
  }

  for (const manualInterest of manualInterests) {
    categoryScores.set(manualInterest, (categoryScores.get(manualInterest) ?? 0) + 5);
  }

  const { confidence, confidenceScore } = getConfidence(repositories.length, eligibleRepos.length);

  return {
    repoCount: repositories.length,
    analyzedRepoCount: eligibleRepos.length,
    confidence,
    confidenceScore,
    topCategories: takeTopEntries(categoryScores, 4),
    topSubcategories: takeTopEntries(subcategoryScores, 6),
    topTags: takeTopEntries(tagScores, 8),
    topLanguages: takeTopEntries(languageScores, 4),
    manualInterests,
    lastAnalyzedAt: new Date().toISOString()
  };
}

function scoreProjectForProfile(
  project: Project,
  profile: UserInterestProfile,
  viewerRepoNames: Set<string>,
  viewerGithubLogin?: string
) {
  if (project.githubFullName && viewerRepoNames.has(project.githubFullName.toLowerCase())) {
    return -1;
  }

  if (viewerGithubLogin && project.githubFullName?.toLowerCase().startsWith(`${viewerGithubLogin.toLowerCase()}/`)) {
    return -1;
  }

  let score = 0;

  const categoryIndex = profile.topCategories.indexOf(project.primaryCategory);
  if (categoryIndex >= 0) {
    score += Math.max(18 - categoryIndex * 4, 6);
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

  for (const language of profile.topLanguages) {
    if (project.language === language) {
      score += 4;
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
  viewerRepoNames?: string[];
  viewerGithubLogin?: string;
}): Promise<PersonalizedHomeData> {
  const [projects, creators, curatedProjects] = await Promise.all([
    getProjects(),
    getCreators(),
    getCuratedProjects()
  ]);
  const viewerRepoNames = new Set((options.viewerRepoNames ?? []).map((value) => value.toLowerCase()));

  const scoredProjects: ScoredProject[] = projects
    .map((project) => ({
      project,
      score: scoreProjectForProfile(project, options.profile, viewerRepoNames, options.viewerGithubLogin)
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
  } satisfies PersonalizedHomeData;
}

export async function syncInterestProfileFromGitHub(options: {
  accessToken: string;
  manualInterests?: string[];
}) {
  const repositories = await fetchGitHubViewerRepositories(options.accessToken);
  const profile = deriveInterestProfileFromRepositories(repositories, options.manualInterests ?? []);

  return {
    profile,
    repositories
  };
}

export function getSuggestedInterestCategories() {
  return categories.map((category) => ({
    slug: category.slug,
    name: category.name
  }));
}
