import type { Category } from "@/lib/types";

export type CuratedContextualLabel = "Why it matters" | "Best for" | "What it solves";

export type CuratedRepoSource = {
  repoFullName: string;
  title?: string;
  primaryCategory: string;
  contextualLabel: CuratedContextualLabel;
  contextualText: string;
  featuredInCollectionSlugs: string[];
  tags?: string[];
  featured?: boolean;
  claimed?: boolean;
  demoUrl?: string;
  docsUrl?: string;
};

export type ImportedRepoSource = {
  repoFullName: string;
  primaryCategory: string;
  contextualLabel: CuratedContextualLabel;
  contextualText: string;
  tags: string[];
  claimIntent: "recommend" | "creator";
  submittedAt: string;
  submittedBy: string;
};

export type BulkCategoryQuery = {
  category: string;
  query: string;
};

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

export const curatedRepoSources: CuratedRepoSource[] = [
  {
    repoFullName: "crewAIInc/crewAI",
    title: "crewAI",
    primaryCategory: "ai-agents",
    contextualLabel: "Why it matters",
    contextualText:
      "It turns multi-agent orchestration into a reusable open-source surface instead of a one-off notebook demo.",
    featuredInCollectionSlugs: ["agent-workflows-worth-studying"],
    tags: ["multi-agent", "orchestration", "llm"],
    featured: true,
    claimed: true
  },
  {
    repoFullName: "microsoft/autogen",
    title: "AutoGen",
    primaryCategory: "ai-agents",
    contextualLabel: "Best for",
    contextualText:
      "Builders studying agent collaboration, tool use, and the design patterns behind serious agent systems.",
    featuredInCollectionSlugs: ["agent-workflows-worth-studying"],
    tags: ["agents", "tool-use", "research-to-product"],
    claimed: true
  },
  {
    repoFullName: "n8n-io/n8n",
    title: "n8n",
    primaryCategory: "automation",
    contextualLabel: "What it solves",
    contextualText:
      "The gap between brittle one-off scripts and a reusable automation stack that non-engineers can also operate.",
    featuredInCollectionSlugs: ["automation-systems-that-ship"],
    tags: ["automation", "workflow", "self-hosted"],
    featured: true,
    claimed: true
  },
  {
    repoFullName: "activepieces/activepieces",
    title: "Activepieces",
    primaryCategory: "automation",
    contextualLabel: "Best for",
    contextualText:
      "Teams that want Product Hunt-style automation polish without giving up open-source control or forkability.",
    featuredInCollectionSlugs: ["automation-systems-that-ship"],
    tags: ["workflow", "integrations", "open source"],
    claimed: true
  },
  {
    repoFullName: "microsoft/playwright",
    title: "Playwright",
    primaryCategory: "devtools",
    contextualLabel: "Why it matters",
    contextualText:
      "It is the kind of developer tool that changes shipping confidence, not just syntax or ergonomics.",
    featuredInCollectionSlugs: ["devtools-with-operator-leverage"],
    tags: ["testing", "browser automation", "qa"],
    featured: true,
    claimed: true
  },
  {
    repoFullName: "vercel/next.js",
    title: "Next.js",
    primaryCategory: "starters",
    contextualLabel: "What it solves",
    contextualText:
      "The need for a production-ready full-stack web foundation that still leaves room for product-specific taste.",
    featuredInCollectionSlugs: ["starter-projects-worth-forking"],
    tags: ["react", "framework", "full-stack"],
    claimed: true
  },
  {
    repoFullName: "t3-oss/create-t3-app",
    title: "Create T3 App",
    primaryCategory: "starters",
    contextualLabel: "Best for",
    contextualText:
      "Builders who want a pragmatic TypeScript starter with enough defaults to move fast and enough openness to fork.",
    featuredInCollectionSlugs: ["starter-projects-worth-forking"],
    tags: ["starter", "typescript", "templates"],
    claimed: true
  },
  {
    repoFullName: "shadcn-ui/ui",
    title: "shadcn/ui",
    primaryCategory: "devtools",
    contextualLabel: "Why it matters",
    contextualText:
      "It made design-system reuse feel creator-friendly by shipping code you own instead of a black-box component package.",
    featuredInCollectionSlugs: ["devtools-with-operator-leverage", "starter-projects-worth-forking"],
    tags: ["ui", "design system", "copy-paste"],
    claimed: true
  }
];

export const curatedCollections = [
  {
    id: "collection-1",
    slug: "agent-workflows-worth-studying",
    title: "Agent Workflows Worth Studying",
    description:
      "Projects that expose orchestration patterns and reusable structure instead of only showing a flashy AI demo.",
    editorName: "Platform Editorial",
    tags: ["agents", "orchestration", "reuse"],
    repoFullNames: ["crewAIInc/crewAI", "microsoft/autogen"]
  },
  {
    id: "collection-2",
    slug: "automation-systems-that-ship",
    title: "Automation Systems That Ship",
    description:
      "Operational tooling that is concrete enough to run today and structured enough to extend tomorrow.",
    editorName: "Platform Editorial",
    tags: ["automation", "operators", "workflow"],
    repoFullNames: ["n8n-io/n8n", "activepieces/activepieces"]
  },
  {
    id: "collection-3",
    slug: "starter-projects-worth-forking",
    title: "Starter Projects Worth Forking",
    description:
      "Foundations that save time without trapping your product shape inside someone else's abstraction choices.",
    editorName: "Platform Editorial",
    tags: ["starter kits", "forkable", "builders"],
    repoFullNames: ["vercel/next.js", "t3-oss/create-t3-app", "shadcn-ui/ui"]
  },
  {
    id: "collection-4",
    slug: "devtools-with-operator-leverage",
    title: "Devtools With Operator Leverage",
    description:
      "Developer products that meaningfully change confidence, speed, or team throughput rather than adding surface area.",
    editorName: "Platform Editorial",
    tags: ["devtools", "leverage", "quality"],
    repoFullNames: ["microsoft/playwright", "shadcn-ui/ui"]
  }
];

export const bulkCategoryQueries: BulkCategoryQuery[] = [
  { category: "ai-agents", query: "topic:ai-agents fork:false archived:false stars:>50" },
  { category: "ai-agents", query: "topic:llm fork:false archived:false stars:>80" },
  { category: "automation", query: "topic:automation fork:false archived:false stars:>40" },
  { category: "automation", query: "topic:workflow-automation fork:false archived:false stars:>20" },
  { category: "devtools", query: "topic:devtools fork:false archived:false stars:>60" },
  { category: "devtools", query: "topic:developer-tools fork:false archived:false stars:>60" },
  { category: "devtools", query: "topic:testing fork:false archived:false stars:>100" },
  { category: "starters", query: "topic:starter-kit fork:false archived:false stars:>30" },
  { category: "starters", query: "topic:template fork:false archived:false stars:>80" },
  { category: "starters", query: "topic:boilerplate fork:false archived:false stars:>50" }
];

export const bulkCategoryNarratives: Record<
  string,
  { contextualLabel: CuratedContextualLabel; contextualText: string }
> = {
  "ai-agents": {
    contextualLabel: "Why it matters",
    contextualText:
      "Agent tooling is producing a new layer of reusable developer products, and the valuable repos are the ones builders can actually learn from or build on."
  },
  automation: {
    contextualLabel: "What it solves",
    contextualText:
      "Automation repos are useful only when they reduce repeat work in a way another builder can adapt, self-host, and trust."
  },
  devtools: {
    contextualLabel: "Why it matters",
    contextualText:
      "Good devtools change operator confidence and throughput, not just package counts or interface polish."
  },
  starters: {
    contextualLabel: "Best for",
    contextualText:
      "Builders who want a concrete starting point that saves real time without hiding the structure they will need to fork."
  }
};
