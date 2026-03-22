import { getProjectBySlug, getProjects } from "@/lib/catalog";

function parseRepoPath(input: string) {
  try {
    const parsedUrl = new URL(input);
    if (parsedUrl.hostname !== "github.com" && parsedUrl.hostname !== "www.github.com") {
      return null;
    }

    const segments = parsedUrl.pathname
      .replace(/\/+$/, "")
      .replace(/^\//, "")
      .split("/")
      .filter(Boolean);

    if (segments.length < 2) {
      return null;
    }

    const owner = segments[0].toLowerCase();
    const repo = segments[1].replace(/\.git$/i, "").toLowerCase();
    if (!owner || !repo) {
      return null;
    }

    return { owner, repo };
  } catch {
    return null;
  }
}

export function normalizeGitHubRepoUrl(input: string) {
  const parsed = parseRepoPath(input.trim());
  if (!parsed) {
    return null;
  }

  return `https://github.com/${parsed.owner}/${parsed.repo}`;
}

export function getGitHubRepoFullName(input: string) {
  const parsed = parseRepoPath(input.trim());
  if (!parsed) {
    return null;
  }

  return `${parsed.owner}/${parsed.repo}`;
}

export async function findProjectByRepoUrl(input: string) {
  const normalized = normalizeGitHubRepoUrl(input);
  if (!normalized) {
    return null;
  }

  const projects = await getProjects();
  const matchedProject = projects.find(
    (project) => normalizeGitHubRepoUrl(project.githubUrl) === normalized
  );
  if (!matchedProject) {
    return null;
  }

  return getProjectBySlug(matchedProject.slug);
}
