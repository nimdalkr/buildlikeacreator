import type { Category, Collection, Creator, Project, SearchResult } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "ai-agents",
    name: "AI + Agents",
    description: "Agent workflows, assistants, orchestration tools, and applied LLM products."
  },
  {
    slug: "devtools",
    name: "Developer Tools",
    description: "Tooling that makes building, debugging, and shipping faster."
  },
  {
    slug: "automation",
    name: "Automation",
    description: "Glue code, workflows, CLI helpers, and systems that remove repeated effort."
  },
  {
    slug: "starters",
    name: "Starter Kits",
    description: "Reusable starter repos, templates, and foundations worth forking."
  }
];

export const creators: Creator[] = [
  {
    id: "creator-1",
    slug: "mina-cho",
    displayName: "Mina Cho",
    githubLogin: "minacho",
    bio: "Builds small AI tools that feel shippable on day one instead of impressive in a benchmark.",
    websiteUrl: "https://example.com/mina",
    specialties: ["AI agents", "Productized prompts", "Next.js"],
    projectCount: 3,
    followers: 1840,
    claimed: true
  },
  {
    id: "creator-2",
    slug: "jay-park",
    displayName: "Jay Park",
    githubLogin: "jaypark-dev",
    bio: "Turns messy operator workflows into narrow, dependable automation tools.",
    specialties: ["Automation", "CLI", "Postgres"],
    projectCount: 2,
    followers: 910,
    claimed: true
  },
  {
    id: "creator-3",
    slug: "unclaimed-builder",
    displayName: "Unclaimed Builder",
    githubLogin: "pending-claim",
    bio: "A recommended creator profile waiting to be claimed by the original builder.",
    specialties: ["Experimental tools", "Open source"],
    projectCount: 1,
    followers: 0,
    claimed: false
  }
];

export const projects: Project[] = [
  {
    id: "project-1",
    slug: "agent-handbook",
    title: "Agent Handbook",
    summary: "A repo-to-playbook tool that turns scattered agent experiments into reusable runbooks.",
    longDescription:
      "Agent Handbook packages prompt systems, runbooks, and operator notes into a single reusable project surface. It is built for builders who want more than a README and less than a full product suite.",
    contextualLabel: "Why it matters",
    contextualText:
      "It shows the reasoning layer behind agent workflows, so builders can copy the method instead of just the code.",
    status: "featured",
    statusLabel: "Featured",
    claimed: true,
    creatorId: "creator-1",
    primaryCategory: "AI + Agents",
    tags: ["agent ops", "playbooks", "reuse"],
    language: "TypeScript",
    githubUrl: "https://github.com/minacho/agent-handbook",
    demoUrl: "https://example.com/agent-handbook",
    docsUrl: "https://example.com/agent-handbook/docs",
    updatedLabel: "3 days ago",
    updatedAt: "2026-03-18",
    saves: 412,
    likes: 266,
    featuredInCollectionSlugs: ["starter-projects-worth-forking", "tools-with-a-point-of-view"]
  },
  {
    id: "project-2",
    slug: "briefsync",
    title: "BriefSync",
    summary: "A lightweight intake and routing tool for turning noisy client requests into executable engineering briefs.",
    longDescription:
      "BriefSync ingests messy request threads, extracts intent, and produces short implementation notes for product and engineering teams. It emphasizes clarity over broad automation.",
    contextualLabel: "Best for",
    contextualText:
      "Small teams who need a reliable intake ritual before work turns into tickets, code, or client replies.",
    status: "active",
    statusLabel: "Maintained",
    claimed: true,
    creatorId: "creator-2",
    primaryCategory: "Automation",
    tags: ["ops", "client-work", "workflow"],
    language: "Python",
    githubUrl: "https://github.com/jaypark-dev/briefsync",
    demoUrl: "https://example.com/briefsync",
    docsUrl: "https://example.com/briefsync/docs",
    updatedLabel: "11 days ago",
    updatedAt: "2026-03-10",
    saves: 219,
    likes: 144,
    featuredInCollectionSlugs: ["founder-automation-stack"]
  },
  {
    id: "project-3",
    slug: "starter-lab",
    title: "Starter Lab",
    summary: "A curated monorepo starter that balances fast shipping with enough structure to fork confidently.",
    longDescription:
      "Starter Lab focuses on the first week of product work. It includes opinionated route scaffolds, typed API edges, and UI primitives while staying smaller than a full internal platform template.",
    contextualLabel: "What it solves",
    contextualText:
      "The gap between empty repo boilerplate and overbuilt enterprise starter kits that solo builders never finish adapting.",
    status: "limited",
    statusLabel: "Limited activity",
    claimed: false,
    creatorId: "creator-3",
    primaryCategory: "Starter Kits",
    tags: ["starter", "monorepo", "templates"],
    language: "TypeScript",
    githubUrl: "https://github.com/pending-claim/starter-lab",
    docsUrl: "https://example.com/starter-lab/docs",
    updatedLabel: "5 months ago",
    updatedAt: "2025-10-28",
    saves: 94,
    likes: 61,
    featuredInCollectionSlugs: ["starter-projects-worth-forking"]
  },
  {
    id: "project-4",
    slug: "signal-watch",
    title: "Signal Watch",
    summary: "Tracks repo health, release cadence, and link quality so discovery feeds do not rot into a graveyard.",
    longDescription:
      "Signal Watch is a maintainability monitor for curation surfaces. It keeps quality signals attached to a project so editors and users can distinguish active tools from abandoned experiments.",
    contextualLabel: "Why it matters",
    contextualText:
      "Good curation dies when dead repos look identical to living ones. This tool makes that difference visible.",
    status: "active",
    statusLabel: "Maintained",
    claimed: true,
    creatorId: "creator-2",
    primaryCategory: "Developer Tools",
    tags: ["health", "ranking", "quality"],
    language: "Go",
    githubUrl: "https://github.com/jaypark-dev/signal-watch",
    demoUrl: "https://example.com/signal-watch",
    updatedLabel: "2 weeks ago",
    updatedAt: "2026-03-06",
    saves: 171,
    likes: 132,
    featuredInCollectionSlugs: ["tools-with-a-point-of-view"]
  }
];

export const collections: Collection[] = [
  {
    id: "collection-1",
    slug: "starter-projects-worth-forking",
    title: "Starter Projects Worth Forking",
    description:
      "Seed-stage repos that are opinionated enough to save time, but not so rigid that they trap your product shape.",
    editorName: "Platform Editorial",
    tags: ["starter kits", "forkable", "builders"],
    projectSlugs: ["starter-lab", "agent-handbook"]
  },
  {
    id: "collection-2",
    slug: "tools-with-a-point-of-view",
    title: "Tools With a Strong Point of View",
    description:
      "Projects that stand out because the builder clearly decided what to optimize for and what to leave out.",
    editorName: "Platform Editorial",
    tags: ["editorial", "taste", "clarity"],
    projectSlugs: ["agent-handbook", "signal-watch"]
  },
  {
    id: "collection-3",
    slug: "founder-automation-stack",
    title: "Founder Automation Stack",
    description:
      "Small systems that help solo founders turn messy work into repeatable operating flows.",
    editorName: "Platform Editorial",
    tags: ["automation", "founders", "operators"],
    projectSlugs: ["briefsync"]
  }
];

export function getCreatorById(creatorId: string) {
  return creators.find((creator) => creator.id === creatorId);
}

export function getCreatorBySlug(slug: string) {
  return creators.find((creator) => creator.slug === slug);
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProjectsForCreator(creatorId: string) {
  return projects.filter((project) => project.creatorId === creatorId);
}

export function getProjectsForCollection(collectionSlug: string) {
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) {
    return [];
  }

  return collection.projectSlugs
    .map((projectSlug) => getProjectBySlug(projectSlug))
    .filter((project): project is Project => Boolean(project));
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.status === "featured");
}

export function getTrendingProjects() {
  return [...projects].sort((left, right) => right.saves + right.likes - (left.saves + left.likes));
}

export function getSearchResults(query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const projectResults = projects
    .filter((project) =>
      [
        project.title,
        project.summary,
        project.contextualText,
        project.primaryCategory,
        ...project.tags
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

export function getProjectsByCategory(categorySlug?: string, sort = "trending") {
  const filtered = categorySlug
    ? projects.filter((project) => {
        const matchedCategory = categories.find((category) => category.name === project.primaryCategory);
        return matchedCategory?.slug === categorySlug;
      })
    : projects;

  const ranked = [...filtered];
  if (sort === "newest") {
    ranked.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  } else if (sort === "saved") {
    ranked.sort((left, right) => right.saves - left.saves);
  } else {
    ranked.sort((left, right) => right.saves + right.likes - (left.saves + left.likes));
  }

  return ranked;
}
