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

export type GitHubViewerRepository = GitHubRepoResponse;

export type GitHubRepoDeepSignals = {
  repoFullName: string;
  readmePreview: string;
  detectedKeywords: string[];
  representativeFiles: string[];
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

type GitHubGraphqlPinnedResponse = {
  data?: {
    viewer?: {
      pinnedItems?: {
        nodes?: GitHubPinnedRepositoryNode[];
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
};

type GitHubPinnedRepositoryNode = {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  watchers: { totalCount: number };
  issues: { totalCount: number };
  primaryLanguage: { name: string } | null;
  repositoryTopics: {
    nodes: Array<{
      topic: { name: string };
    }>;
  };
  isFork: boolean;
  isArchived: boolean;
  isPrivate: boolean;
  defaultBranchRef: { name: string } | null;
  pushedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  licenseInfo: {
    spdxId: string | null;
    name: string | null;
  } | null;
  owner: {
    login: string;
    avatarUrl: string;
    url: string;
    __typename: string;
  };
};

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
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

function getViewerGitHubHeaders(accessToken: string) {
  return new Headers({
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": "build-like-a-creator",
    "X-GitHub-Api-Version": "2022-11-28"
  });
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

async function fetchViewerGitHubJson<T>(path: string, accessToken: string) {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: getViewerGitHubHeaders(accessToken),
    signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub viewer request failed: ${response.status} ${response.statusText} for ${path}`);
  }

  return (await response.json()) as T;
}

async function fetchViewerGitHubText(path: string, accessToken: string) {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: new Headers({
      Accept: "application/vnd.github.raw+json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "build-like-a-creator",
      "X-GitHub-Api-Version": "2022-11-28"
    }),
    signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
    cache: "no-store"
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub viewer text request failed: ${response.status} ${response.statusText} for ${path}`);
  }

  return response.text();
}

function mapGraphqlPinnedRepositoryToViewerRepository(node: GitHubPinnedRepositoryNode): GitHubViewerRepository {
  return {
    id: Number(node.id.replace(/\D+/g, "")) || Date.now(),
    name: node.name,
    full_name: node.nameWithOwner,
    description: node.description,
    html_url: node.url,
    homepage: node.homepageUrl,
    stargazers_count: node.stargazerCount,
    forks_count: node.forkCount,
    watchers_count: node.watchers.totalCount,
    open_issues_count: node.issues.totalCount,
    language: node.primaryLanguage?.name ?? null,
    topics: node.repositoryTopics.nodes.map((entry: { topic: { name: string } }) => entry.topic.name),
    fork: node.isFork,
    archived: node.isArchived,
    private: node.isPrivate,
    default_branch: node.defaultBranchRef?.name ?? null,
    pushed_at: node.pushedAt,
    created_at: node.createdAt,
    updated_at: node.updatedAt,
    license: node.licenseInfo
      ? {
          spdx_id: node.licenseInfo.spdxId,
          name: node.licenseInfo.name
        }
      : null,
    owner: {
      login: node.owner.login,
      type: node.owner.__typename,
      avatar_url: node.owner.avatarUrl,
      html_url: node.owner.url
    }
  };
}

function normalizeTextPreview(input: string | null, limit = 900) {
  if (!input) {
    return "";
  }

  return input
    .replace(/\r/g, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function detectRepositoryKeywords(input: string) {
  const text = input.toLowerCase();
  const matches = new Set<string>();
  const keywordMap: Record<string, string[]> = {
    "next.js": ["next.js", "\"next\"", "next-auth", "app router"],
    React: ["react", "react-dom", "jsx", "tsx"],
    TypeScript: ["typescript", "tsconfig", "\"typescript\""],
    Python: ["python", "pyproject", "requirements.txt", "fastapi", "django", "flask"],
    FastAPI: ["fastapi"],
    Django: ["django"],
    LangChain: ["langchain"],
    LlamaIndex: ["llamaindex"],
    OpenAI: ["openai"],
    Anthropic: ["anthropic", "claude"],
    Playwright: ["playwright"],
    Docker: ["dockerfile", "docker compose", "docker-compose"],
    Prisma: ["prisma"],
    Supabase: ["supabase"],
    Postgres: ["postgres", "postgresql"],
    Stripe: ["stripe"],
    Tailwind: ["tailwind", "tailwindcss"],
    Kubernetes: ["kubernetes", "helm", "k8s"],
    Rust: ["cargo.toml", "rust", "crates.io"],
    Go: ["go.mod", "golang"],
    CLI: ["command line", "cli", "terminal ui"],
    API: ["rest api", "graphql", "api server"],
    SDK: ["sdk"],
    Template: ["starter", "boilerplate", "template"],
    Automation: ["automation", "workflow", "orchestration"],
    Agents: ["agent", "multi-agent", "agentic"],
    RAG: ["rag", "retrieval"],
    OCR: ["ocr"],
    Analytics: ["analytics", "dashboard", "grafana", "superset"],
    SEO: ["seo", "keyword research"],
    Web3: ["web3", "blockchain", "wallet", "solidity", "defi"],
    Discord: ["discord bot", "discord.js", "discord.py"],
    Telegram: ["telegram bot", "telethon"],
    Godot: ["godot"],
    Unity: ["unity"]
  };

  for (const [label, needles] of Object.entries(keywordMap)) {
    if (needles.some((needle) => text.includes(needle))) {
      matches.add(label);
    }
  }

  return [...matches].slice(0, 12);
}

function detectRepresentativeFiles(fileContentMap: Record<string, string | null>) {
  const representativeFiles = Object.entries(fileContentMap)
    .filter(([, content]) => content !== null)
    .map(([file]) => file);

  const detectedKeywords = new Set<string>();
  const combinedText = Object.entries(fileContentMap)
    .map(([file, content]) => `${file}\n${content ?? ""}`)
    .join("\n");

  for (const keyword of detectRepositoryKeywords(combinedText)) {
    detectedKeywords.add(keyword);
  }

  return {
    representativeFiles,
    detectedKeywords: [...detectedKeywords]
  };
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

export async function fetchGitHubViewerRepositories(accessToken: string) {
  const maxPages = Number(process.env.GITHUB_VIEWER_REPO_PAGES ?? "3");
  const perPage = 100;
  const repositories: GitHubViewerRepository[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const pageItems = await fetchViewerGitHubJson<GitHubViewerRepository[]>(
      `/user/repos?affiliation=owner&sort=updated&per_page=${perPage}&page=${page}`,
      accessToken
    );
    repositories.push(...pageItems);

    if (pageItems.length < perPage) {
      break;
    }
  }

  return repositories;
}

export async function fetchGitHubViewerStarredRepositories(accessToken: string) {
  const maxPages = Number(process.env.GITHUB_VIEWER_STARRED_PAGES ?? "2");
  const perPage = 100;
  const repositories: GitHubViewerRepository[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const pageItems = await fetchViewerGitHubJson<GitHubViewerRepository[]>(
      `/user/starred?sort=updated&per_page=${perPage}&page=${page}`,
      accessToken
    );
    repositories.push(...pageItems);

    if (pageItems.length < perPage) {
      break;
    }
  }

  return repositories;
}

export async function fetchGitHubViewerPinnedRepositories(accessToken: string) {
  const first = Number(process.env.GITHUB_VIEWER_PINNED_COUNT ?? "6");
  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "User-Agent": "build-like-a-creator",
      Accept: "application/vnd.github+json"
    }),
    signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query ViewerPinnedRepositories($first: Int!) {
          viewer {
            pinnedItems(first: $first, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  id
                  name
                  nameWithOwner
                  description
                  url
                  homepageUrl
                  stargazerCount
                  forkCount
                  watchers {
                    totalCount
                  }
                  issues(states: OPEN) {
                    totalCount
                  }
                  primaryLanguage {
                    name
                  }
                  repositoryTopics(first: 10) {
                    nodes {
                      topic {
                        name
                      }
                    }
                  }
                  isFork
                  isArchived
                  isPrivate
                  defaultBranchRef {
                    name
                  }
                  pushedAt
                  createdAt
                  updatedAt
                  licenseInfo {
                    spdxId
                    name
                  }
                  owner {
                    login
                    avatarUrl
                    url
                    __typename
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        first
      }
    })
  });

  if (!response.ok) {
    throw new Error(`GitHub pinned repositories request failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as GitHubGraphqlPinnedResponse;
  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "GitHub pinned repositories query failed");
  }

  const nodes = payload.data?.viewer?.pinnedItems?.nodes ?? [];
  return nodes.map(mapGraphqlPinnedRepositoryToViewerRepository);
}

export async function fetchGitHubRepositoryDeepSignals(fullName: string, accessToken: string): Promise<GitHubRepoDeepSignals> {
  const [owner, repo] = fullName.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid GitHub repository name: ${fullName}`);
  }

  const readmeText = await fetchViewerGitHubText(`/repos/${owner}/${repo}/readme`, accessToken).catch(() => null);
  const representativeFilesToCheck = [
    "package.json",
    "pyproject.toml",
    "requirements.txt",
    "Cargo.toml",
    "go.mod",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    "prisma/schema.prisma",
    "vercel.json",
    "wrangler.toml",
    "supabase/config.toml"
  ];
  const encodeContentsPath = (filePath: string) => filePath.split("/").map(encodeURIComponent).join("/");

  const fileEntries = await Promise.all(
    representativeFilesToCheck.map(async (filePath) => {
      const content = await fetchViewerGitHubText(`/repos/${owner}/${repo}/contents/${encodeContentsPath(filePath)}`, accessToken).catch(
        () => null
      );
      return [filePath, content ? content.slice(0, 2000) : null] as const;
    })
  );
  const fileContentMap = Object.fromEntries(fileEntries);
  const fileSignals = detectRepresentativeFiles(fileContentMap);
  const readmePreview = normalizeTextPreview(readmeText);
  const detectedKeywords = new Set([
    ...fileSignals.detectedKeywords,
    ...detectRepositoryKeywords(readmePreview)
  ]);

  return {
    repoFullName: fullName,
    readmePreview,
    detectedKeywords: [...detectedKeywords].slice(0, 16),
    representativeFiles: fileSignals.representativeFiles.slice(0, 8)
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
