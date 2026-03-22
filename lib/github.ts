type GitHubRepoResponse = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  private: boolean;
  default_branch: string | null;
  pushed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  license: {
    spdx_id: string | null;
    name: string | null;
  } | null;
  owner: {
    login: string;
    type: string;
    avatar_url: string;
    html_url: string;
  };
};

export type GitHubSearchRepositoryItem = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  private: boolean;
  default_branch?: string | null;
  pushed_at: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  license?: {
    spdx_id: string | null;
    name: string | null;
  } | null;
  owner: {
    login: string;
    type: string;
    avatar_url: string;
    html_url: string;
  };
};

type GitHubUserResponse = {
  login: string;
  name: string | null;
  bio: string | null;
  blog: string | null;
  avatar_url: string;
  followers: number;
  public_repos: number;
  html_url: string;
};

export type GitHubRepoSnapshot = {
  repo: GitHubRepoResponse;
  owner: GitHubUserResponse;
  fetchedAt: string;
};

type GitHubRepositorySearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchRepositoryItem[];
};

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_REQUEST_TIMEOUT_MS = Number(process.env.GITHUB_REQUEST_TIMEOUT_MS ?? "8000");

function getGitHubHeaders() {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "User-Agent": "build-like-a-creator"
  });

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  headers.set("X-GitHub-Api-Version", "2022-11-28");
  return headers;
}

async function fetchGitHubJson<T>(path: string) {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: getGitHubHeaders(),
    signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText} for ${path}`);
  }

  return (await response.json()) as T;
}

export async function fetchGitHubRepository(fullName: string): Promise<GitHubRepoSnapshot> {
  const [owner, repo] = fullName.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid GitHub repository name: ${fullName}`);
  }

  const repoData = await fetchGitHubJson<GitHubRepoResponse>(`/repos/${owner}/${repo}`);
  const ownerData = await fetchGitHubJson<GitHubUserResponse>(`/users/${repoData.owner.login}`);

  return {
    repo: repoData,
    owner: ownerData,
    fetchedAt: new Date().toISOString()
  };
}

export async function searchGitHubRepositories(
  query: string,
  page = 1,
  perPage = 100,
  sort: "stars" | "updated" = "stars",
  order: "desc" | "asc" = "desc"
) {
  const params = new URLSearchParams({
    q: query,
    sort,
    order,
    per_page: String(perPage),
    page: String(page)
  });

  return fetchGitHubJson<GitHubRepositorySearchResponse>(`/search/repositories?${params.toString()}`);
}
