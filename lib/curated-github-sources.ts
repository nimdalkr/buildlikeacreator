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
  sort?: "stars" | "updated";
  order?: "desc" | "asc";
};

export const categories: Category[] = [
  {
    slug: "ai-llm",
    name: "AI / LLM",
    description: "Generative AI, LLM apps, RAG, voice, vision, and AI-native product layers.",
    subcategories: [
      "Chatbots / Chat UI",
      "RAG / Search",
      "Agent Frameworks",
      "Prompt Tooling",
      "Voice AI",
      "Vision / OCR"
    ]
  },
  {
    slug: "agents-automation",
    name: "Agents / Automation",
    description: "Workflow automation, orchestration, scheduling, browser control, and repeated-work systems.",
    subcategories: [
      "Work Automation",
      "Web Automation",
      "Agent Orchestration",
      "Scheduling / Triggers",
      "Data Collection Automation",
      "No-code Automation"
    ]
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    description: "CLI, code generation, debugging, testing, docs, analysis, and collaboration support.",
    subcategories: [
      "CLI Tools",
      "Code Generation",
      "Debugging Tools",
      "Test Automation",
      "Documentation Tools",
      "Repository Analysis"
    ]
  },
  {
    slug: "templates-boilerplates",
    name: "Templates / Boilerplates",
    description: "Starters and boilerplates for MVPs, SaaS apps, dashboards, AI products, and admin systems.",
    subcategories: [
      "SaaS Boilerplates",
      "Dashboard Templates",
      "Auth / Billing Starters",
      "AI App Starters",
      "Mobile Starters",
      "Admin Templates"
    ]
  },
  {
    slug: "design-frontend",
    name: "Design / Frontend",
    description: "Component systems, landing kits, animation libraries, frontend UI, and design tooling.",
    subcategories: [
      "UI Component Libraries",
      "Design Systems",
      "Animation / Interaction",
      "Landing Templates",
      "Charts / Visualization UI",
      "Icons / Assets"
    ]
  },
  {
    slug: "data-analytics",
    name: "Data / Analytics",
    description: "Crawlers, pipelines, dashboards, reporting tools, BI layers, and realtime monitoring.",
    subcategories: [
      "Data Collection / Crawling",
      "ETL / Pipelines",
      "Dashboards",
      "Charts / Visualization",
      "BI / Reporting",
      "Realtime Monitoring"
    ]
  },
  {
    slug: "marketing-seo-research",
    name: "Marketing / SEO / Research",
    description: "Keyword, content, SEO, marketing automation, social analysis, and research tooling.",
    subcategories: [
      "SEO Analysis",
      "Keyword Research",
      "Content Support",
      "Competitor Analysis",
      "Site Diagnostics",
      "Marketing Automation"
    ]
  },
  {
    slug: "web3-blockchain",
    name: "Web3 / Blockchain",
    description: "Wallets, onchain analytics, DeFi tooling, smart-contract stacks, and blockchain infra.",
    subcategories: [
      "Wallet / Accounts",
      "Onchain Analytics",
      "Portfolio Dashboards",
      "Trading / DeFi",
      "Indexers / Data Collection",
      "Smart Contract Tooling"
    ]
  },
  {
    slug: "community-social",
    name: "Community / Social Tools",
    description: "Bots, community analytics, CRM, event tooling, social feeds, and participation systems.",
    subcategories: [
      "Discord / Telegram Bots",
      "Community Analytics",
      "Leaderboards / Points",
      "Social Feed Collection",
      "Community CRM",
      "Event Management"
    ]
  },
  {
    slug: "gaming-interactive",
    name: "Gaming / Interactive",
    description: "Game examples, simulations, interactive web projects, asset tools, and ranking systems.",
    subcategories: [
      "Game Templates",
      "Engine Examples",
      "Simulation Tools",
      "Game UI Systems",
      "Rankings / Leaderboards",
      "Interactive Web Experiences"
    ]
  }
];

export const curatedRepoSources: CuratedRepoSource[] = [
  {
    repoFullName: "lobe-chat/lobe-chat",
    title: "Lobe Chat",
    primaryCategory: "ai-llm",
    contextualLabel: "Best for",
    contextualText:
      "It makes AI chat product patterns easy to inspect, fork, and adapt instead of hiding them behind a hosted product wall.",
    featuredInCollectionSlugs: ["ai-projects-worth-trying"],
    tags: ["chat-ui", "nextjs", "llm"],
    claimed: true
  },
  {
    repoFullName: "langchain-ai/langchain",
    title: "LangChain",
    primaryCategory: "ai-llm",
    contextualLabel: "What it solves",
    contextualText:
      "It gives builders reusable primitives for retrieval, chains, tools, and LLM workflows that show up across many AI products.",
    featuredInCollectionSlugs: ["ai-projects-worth-trying"],
    tags: ["rag", "llm", "chains"],
    claimed: true
  },
  {
    repoFullName: "run-llama/llama_index",
    title: "LlamaIndex",
    primaryCategory: "ai-llm",
    contextualLabel: "Why it matters",
    contextualText:
      "It narrows the gap between document-heavy data and product-ready retrieval patterns builders can actually reuse.",
    featuredInCollectionSlugs: ["ai-projects-worth-trying"],
    tags: ["rag", "documents", "search"],
    claimed: true
  },
  {
    repoFullName: "crewAIInc/crewAI",
    title: "crewAI",
    primaryCategory: "agents-automation",
    contextualLabel: "Why it matters",
    contextualText:
      "It turns multi-agent orchestration into a reusable open-source surface instead of a one-off notebook demo.",
    featuredInCollectionSlugs: ["agent-workflows-worth-studying"],
    tags: ["agents", "orchestration", "llm"],
    featured: true,
    claimed: true
  },
  {
    repoFullName: "microsoft/autogen",
    title: "AutoGen",
    primaryCategory: "agents-automation",
    contextualLabel: "Best for",
    contextualText:
      "Builders studying serious agent collaboration patterns instead of only a single assistant loop.",
    featuredInCollectionSlugs: ["agent-workflows-worth-studying"],
    tags: ["agents", "multi-agent", "tool-use"],
    claimed: true
  },
  {
    repoFullName: "n8n-io/n8n",
    title: "n8n",
    primaryCategory: "agents-automation",
    contextualLabel: "What it solves",
    contextualText:
      "The gap between brittle one-off scripts and a reusable automation stack that non-engineers can also operate.",
    featuredInCollectionSlugs: ["automation-systems-that-ship"],
    tags: ["workflow", "automation", "integrations"],
    featured: true,
    claimed: true
  },
  {
    repoFullName: "activepieces/activepieces",
    title: "Activepieces",
    primaryCategory: "agents-automation",
    contextualLabel: "Best for",
    contextualText:
      "Teams that want polished automation building blocks without giving up open-source control or forkability.",
    featuredInCollectionSlugs: ["automation-systems-that-ship"],
    tags: ["automation", "workflow", "mcp"],
    claimed: true
  },
  {
    repoFullName: "TriggerDotDev/trigger.dev",
    title: "Trigger.dev",
    primaryCategory: "agents-automation",
    contextualLabel: "Why it matters",
    contextualText:
      "It makes background jobs and automation feel like product code instead of sidecar glue.",
    featuredInCollectionSlugs: ["automation-systems-that-ship"],
    tags: ["jobs", "automation", "scheduling"],
    claimed: true
  },
  {
    repoFullName: "cli/cli",
    title: "GitHub CLI",
    primaryCategory: "developer-tools",
    contextualLabel: "Best for",
    contextualText:
      "Developers who want GitHub workflows to live inside repeatable command-line operations instead of browser-only routine.",
    featuredInCollectionSlugs: ["devtools-with-operator-leverage"],
    tags: ["cli", "github", "automation"],
    claimed: true
  },
  {
    repoFullName: "biomejs/biome",
    title: "Biome",
    primaryCategory: "developer-tools",
    contextualLabel: "Why it matters",
    contextualText:
      "It compresses formatting, linting, and code-quality feedback into one fast developer workflow.",
    featuredInCollectionSlugs: ["devtools-with-operator-leverage"],
    tags: ["linter", "formatter", "typescript"],
    claimed: true
  },
  {
    repoFullName: "microsoft/playwright",
    title: "Playwright",
    primaryCategory: "developer-tools",
    contextualLabel: "Why it matters",
    contextualText:
      "It is the kind of developer tool that changes shipping confidence, not just syntax or ergonomics.",
    featuredInCollectionSlugs: ["devtools-with-operator-leverage"],
    tags: ["testing", "browser-automation", "qa"],
    featured: true,
    claimed: true
  },
  {
    repoFullName: "vercel/next.js",
    title: "Next.js",
    primaryCategory: "templates-boilerplates",
    contextualLabel: "What it solves",
    contextualText:
      "The need for a production-ready full-stack web foundation that still leaves room for product-specific taste.",
    featuredInCollectionSlugs: ["starter-projects-worth-forking"],
    tags: ["framework", "react", "full-stack"],
    claimed: true
  },
  {
    repoFullName: "t3-oss/create-t3-app",
    title: "Create T3 App",
    primaryCategory: "templates-boilerplates",
    contextualLabel: "Best for",
    contextualText:
      "Builders who want a pragmatic TypeScript starter with enough defaults to move fast and enough openness to fork.",
    featuredInCollectionSlugs: ["starter-projects-worth-forking"],
    tags: ["starter", "typescript", "saas"],
    claimed: true
  },
  {
    repoFullName: "payloadcms/payload",
    title: "Payload",
    primaryCategory: "templates-boilerplates",
    contextualLabel: "Best for",
    contextualText:
      "Teams that want a code-first app backbone with admin, content, and auth surfaces they can deeply customize.",
    featuredInCollectionSlugs: ["starter-projects-worth-forking"],
    tags: ["cms", "typescript", "backend"],
    claimed: true
  },
  {
    repoFullName: "shadcn-ui/ui",
    title: "shadcn/ui",
    primaryCategory: "design-frontend",
    contextualLabel: "Why it matters",
    contextualText:
      "It made design-system reuse feel creator-friendly by shipping code you own instead of a black-box package.",
    featuredInCollectionSlugs: ["frontend-systems-worth-reusing"],
    tags: ["ui", "components", "design-system"],
    claimed: true
  },
  {
    repoFullName: "storybookjs/storybook",
    title: "Storybook",
    primaryCategory: "design-frontend",
    contextualLabel: "What it solves",
    contextualText:
      "It turns UI work into a browsable system teams can review, reuse, and maintain outside the full app context.",
    featuredInCollectionSlugs: ["frontend-systems-worth-reusing"],
    tags: ["components", "frontend", "design-system"],
    claimed: true
  },
  {
    repoFullName: "tailwindlabs/tailwindcss",
    title: "Tailwind CSS",
    primaryCategory: "design-frontend",
    contextualLabel: "Best for",
    contextualText:
      "Builders who want a scalable styling system without locking product decisions inside a theme black box.",
    featuredInCollectionSlugs: ["frontend-systems-worth-reusing"],
    tags: ["frontend", "css", "ui"],
    claimed: true
  },
  {
    repoFullName: "apache/superset",
    title: "Apache Superset",
    primaryCategory: "data-analytics",
    contextualLabel: "Why it matters",
    contextualText:
      "It shows what an open analytics product looks like when dashboards and data exploration are treated as product surfaces.",
    featuredInCollectionSlugs: ["data-tools-that-ship"],
    tags: ["analytics", "dashboards", "bi"],
    claimed: true
  },
  {
    repoFullName: "metabase/metabase",
    title: "Metabase",
    primaryCategory: "data-analytics",
    contextualLabel: "Best for",
    contextualText:
      "Teams that want dashboards and reporting layers normal operators can actually use without a data engineering cliff.",
    featuredInCollectionSlugs: ["data-tools-that-ship"],
    tags: ["analytics", "reporting", "dashboards"],
    claimed: true
  },
  {
    repoFullName: "grafana/grafana",
    title: "Grafana",
    primaryCategory: "data-analytics",
    contextualLabel: "What it solves",
    contextualText:
      "It turns monitoring, logs, and dashboards into something teams can inspect continuously instead of only after incidents.",
    featuredInCollectionSlugs: ["data-tools-that-ship"],
    tags: ["monitoring", "observability", "dashboards"],
    claimed: true
  },
  {
    repoFullName: "goabstract/Marketing-analytics-tools",
    title: "Marketing Analytics Tools",
    primaryCategory: "marketing-seo-research",
    contextualLabel: "Best for",
    contextualText:
      "Builders exploring open-source research and marketing utility surfaces without starting from a blank spreadsheet.",
    featuredInCollectionSlugs: [],
    tags: ["marketing", "research", "analytics"],
    claimed: false
  },
  {
    repoFullName: "wevm/wagmi",
    title: "wagmi",
    primaryCategory: "web3-blockchain",
    contextualLabel: "Best for",
    contextualText:
      "Frontend builders shipping wallet-connected apps who need a reusable React-first web3 surface.",
    featuredInCollectionSlugs: ["web3-projects-worth-reusing"],
    tags: ["web3", "wallet", "react"],
    claimed: true
  },
  {
    repoFullName: "wevm/viem",
    title: "viem",
    primaryCategory: "web3-blockchain",
    contextualLabel: "Why it matters",
    contextualText:
      "It gives TypeScript builders a clearer and more modern contract interaction layer than older web3 defaults.",
    featuredInCollectionSlugs: ["web3-projects-worth-reusing"],
    tags: ["web3", "typescript", "contracts"],
    claimed: true
  },
  {
    repoFullName: "NomicFoundation/hardhat",
    title: "Hardhat",
    primaryCategory: "web3-blockchain",
    contextualLabel: "What it solves",
    contextualText:
      "It remains one of the clearest open-source entry points into contract development, testing, and deployment workflows.",
    featuredInCollectionSlugs: ["web3-projects-worth-reusing"],
    tags: ["solidity", "contracts", "tooling"],
    claimed: true
  },
  {
    repoFullName: "discordjs/discord.js",
    title: "discord.js",
    primaryCategory: "community-social",
    contextualLabel: "Best for",
    contextualText:
      "Builders shipping community bots, moderation flows, or Discord-native engagement features.",
    featuredInCollectionSlugs: ["community-tools-for-operators"],
    tags: ["discord", "bots", "community"],
    claimed: true
  },
  {
    repoFullName: "RocketChat/Rocket.Chat",
    title: "Rocket.Chat",
    primaryCategory: "community-social",
    contextualLabel: "Why it matters",
    contextualText:
      "It shows what a self-hosted communication stack looks like when community infrastructure is treated as a real product.",
    featuredInCollectionSlugs: ["community-tools-for-operators"],
    tags: ["community", "messaging", "self-hosted"],
    claimed: true
  },
  {
    repoFullName: "godotengine/godot",
    title: "Godot",
    primaryCategory: "gaming-interactive",
    contextualLabel: "Why it matters",
    contextualText:
      "It remains one of the clearest open-source examples of a creator-first engine ecosystem that is still practical to ship with.",
    featuredInCollectionSlugs: ["interactive-projects-worth-exploring"],
    tags: ["game-engine", "godot", "interactive"],
    claimed: true
  },
  {
    repoFullName: "phaserjs/phaser",
    title: "Phaser",
    primaryCategory: "gaming-interactive",
    contextualLabel: "Best for",
    contextualText:
      "Web builders prototyping games or playful interactive experiences without leaving the JavaScript stack.",
    featuredInCollectionSlugs: ["interactive-projects-worth-exploring"],
    tags: ["games", "html5", "interactive"],
    claimed: true
  },
  {
    repoFullName: "pmndrs/react-three-fiber",
    title: "react-three-fiber",
    primaryCategory: "gaming-interactive",
    contextualLabel: "What it solves",
    contextualText:
      "It turns 3D interactive work into something React builders can reason about and ship inside normal product workflows.",
    featuredInCollectionSlugs: ["interactive-projects-worth-exploring"],
    tags: ["3d", "react", "interactive"],
    claimed: true
  }
];

export const curatedCollections = [
  {
    id: "collection-1",
    slug: "ai-projects-worth-trying",
    title: "AI Projects Worth Trying",
    description:
      "LLM projects that are concrete enough to run, inspect, and build on instead of only reading about.",
    editorName: "Platform Editorial",
    tags: ["ai", "llm", "builders"],
    repoFullNames: ["lobe-chat/lobe-chat", "langchain-ai/langchain", "run-llama/llama_index"]
  },
  {
    id: "collection-2",
    slug: "agent-workflows-worth-studying",
    title: "Agent Workflows Worth Studying",
    description:
      "Projects that expose orchestration patterns and reusable structure instead of only showing a flashy AI demo.",
    editorName: "Platform Editorial",
    tags: ["agents", "orchestration", "reuse"],
    repoFullNames: [
      "crewAIInc/crewAI",
      "microsoft/autogen",
      "n8n-io/n8n",
      "activepieces/activepieces"
    ]
  },
  {
    id: "collection-3",
    slug: "automation-systems-that-ship",
    title: "Automation Systems That Ship",
    description:
      "Operational tooling that is concrete enough to run today and structured enough to extend tomorrow.",
    editorName: "Platform Editorial",
    tags: ["automation", "operators", "workflow"],
    repoFullNames: ["n8n-io/n8n", "activepieces/activepieces", "TriggerDotDev/trigger.dev"]
  },
  {
    id: "collection-4",
    slug: "devtools-with-operator-leverage",
    title: "Devtools With Operator Leverage",
    description:
      "Developer products that meaningfully change confidence, speed, or team throughput rather than adding surface area.",
    editorName: "Platform Editorial",
    tags: ["devtools", "leverage", "quality"],
    repoFullNames: ["cli/cli", "biomejs/biome", "microsoft/playwright"]
  },
  {
    id: "collection-5",
    slug: "starter-projects-worth-forking",
    title: "Starter Projects Worth Forking",
    description:
      "Foundations that save time without trapping your product shape inside someone else's abstraction choices.",
    editorName: "Platform Editorial",
    tags: ["starter-kits", "forkable", "builders"],
    repoFullNames: ["vercel/next.js", "t3-oss/create-t3-app", "payloadcms/payload"]
  },
  {
    id: "collection-6",
    slug: "frontend-systems-worth-reusing",
    title: "Frontend Systems Worth Reusing",
    description:
      "UI and frontend projects with structure builders can copy, fork, and adapt into their own product surfaces.",
    editorName: "Platform Editorial",
    tags: ["frontend", "ui", "design-system"],
    repoFullNames: ["shadcn-ui/ui", "storybookjs/storybook", "tailwindlabs/tailwindcss"]
  },
  {
    id: "collection-7",
    slug: "data-tools-that-ship",
    title: "Data Tools That Ship",
    description:
      "Dashboards, analytics, and monitoring projects that can move beyond demos into repeatable real use.",
    editorName: "Platform Editorial",
    tags: ["analytics", "dashboards", "reporting"],
    repoFullNames: ["apache/superset", "metabase/metabase", "grafana/grafana"]
  },
  {
    id: "collection-8",
    slug: "web3-projects-worth-reusing",
    title: "Web3 Projects Worth Reusing",
    description:
      "Contract and wallet tooling that is practical enough to study, fork, and plug into real web3 builds.",
    editorName: "Platform Editorial",
    tags: ["web3", "wallet", "contracts"],
    repoFullNames: ["wevm/wagmi", "wevm/viem", "NomicFoundation/hardhat"]
  },
  {
    id: "collection-9",
    slug: "community-tools-for-operators",
    title: "Community Tools For Operators",
    description:
      "Bots and communication systems that help teams run communities instead of just observing them.",
    editorName: "Platform Editorial",
    tags: ["community", "bots", "operations"],
    repoFullNames: ["discordjs/discord.js", "RocketChat/Rocket.Chat"]
  },
  {
    id: "collection-10",
    slug: "interactive-projects-worth-exploring",
    title: "Interactive Projects Worth Exploring",
    description:
      "Game and interactive systems with enough structure to learn from, fork, or turn into product experiments.",
    editorName: "Platform Editorial",
    tags: ["games", "interactive", "creative-tech"],
    repoFullNames: ["godotengine/godot", "phaserjs/phaser", "pmndrs/react-three-fiber"]
  }
];

export const bulkCategoryQueries: BulkCategoryQuery[] = [
  { category: "ai-llm", query: "topic:llm fork:false archived:false stars:>30" },
  { category: "ai-llm", query: "topic:rag fork:false archived:false stars:>20" },
  { category: "ai-llm", query: "topic:chatbot fork:false archived:false stars:>20" },
  { category: "ai-llm", query: "topic:voice-ai fork:false archived:false stars:>10" },
  { category: "ai-llm", query: "\"document qa\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "ai-llm", query: "topic:prompt-engineering fork:false archived:false stars:>10" },
  { category: "ai-llm", query: "topic:ai-agents fork:false archived:false stars:>20" },
  { category: "ai-llm", query: "topic:ocr fork:false archived:false stars:>15" },
  { category: "ai-llm", query: "\"chat ui\" in:name,description fork:false archived:false stars:>15", sort: "updated" },
  { category: "ai-llm", query: "\"llm evaluation\" in:name,description fork:false archived:false stars:>10" },
  { category: "ai-llm", query: "\"vector database\" in:name,description fork:false archived:false stars:>20" },
  { category: "ai-llm", query: "\"voice assistant\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "agents-automation", query: "topic:agent-framework fork:false archived:false stars:>10" },
  { category: "agents-automation", query: "topic:automation fork:false archived:false stars:>20" },
  { category: "agents-automation", query: "topic:workflow-automation fork:false archived:false stars:>15" },
  { category: "agents-automation", query: "\"web automation\" in:name,description fork:false archived:false stars:>15", sort: "updated" },
  { category: "agents-automation", query: "\"agent orchestration\" in:name,description fork:false archived:false stars:>10" },
  { category: "agents-automation", query: "topic:browser-automation fork:false archived:false stars:>20" },
  { category: "agents-automation", query: "topic:scheduling fork:false archived:false stars:>10" },
  { category: "agents-automation", query: "\"background jobs\" in:name,description fork:false archived:false stars:>20", sort: "updated" },
  { category: "agents-automation", query: "\"no-code automation\" in:name,description fork:false archived:false stars:>10" },
  { category: "agents-automation", query: "\"data pipeline automation\" in:name,description fork:false archived:false stars:>10" },
  { category: "agents-automation", query: "\"email automation\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "agents-automation", query: "\"trigger based\" in:name,description fork:false archived:false stars:>10" },
  { category: "developer-tools", query: "topic:devtools fork:false archived:false stars:>30" },
  { category: "developer-tools", query: "topic:developer-tools fork:false archived:false stars:>30" },
  { category: "developer-tools", query: "topic:cli fork:false archived:false stars:>80" },
  { category: "developer-tools", query: "topic:codegen fork:false archived:false stars:>15" },
  { category: "developer-tools", query: "topic:code-review fork:false archived:false stars:>10", sort: "updated" },
  { category: "developer-tools", query: "topic:linter fork:false archived:false stars:>20" },
  { category: "developer-tools", query: "topic:formatter fork:false archived:false stars:>20" },
  { category: "developer-tools", query: "topic:testing fork:false archived:false stars:>20" },
  { category: "developer-tools", query: "topic:debugging fork:false archived:false stars:>15" },
  { category: "developer-tools", query: "\"documentation generator\" in:name,description fork:false archived:false stars:>10" },
  { category: "developer-tools", query: "\"repository analysis\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "developer-tools", query: "\"terminal ui\" in:name,description fork:false archived:false stars:>25" },
  { category: "templates-boilerplates", query: "topic:boilerplate fork:false archived:false stars:>30" },
  { category: "templates-boilerplates", query: "topic:starter-kit fork:false archived:false stars:>20" },
  { category: "templates-boilerplates", query: "\"saas starter\" in:name,description fork:false archived:false stars:>10" },
  { category: "templates-boilerplates", query: "\"dashboard template\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "templates-boilerplates", query: "\"admin template\" in:name,description fork:false archived:false stars:>10" },
  { category: "templates-boilerplates", query: "\"nextjs starter\" in:name,description fork:false archived:false stars:>15" },
  { category: "templates-boilerplates", query: "\"stripe starter\" in:name,description fork:false archived:false stars:>10" },
  { category: "templates-boilerplates", query: "\"supabase starter\" in:name,description fork:false archived:false stars:>10" },
  { category: "templates-boilerplates", query: "\"ai starter\" in:name,description fork:false archived:false stars:>10" },
  { category: "templates-boilerplates", query: "\"mobile starter\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "templates-boilerplates", query: "\"chrome extension starter\" in:name,description fork:false archived:false stars:>10" },
  { category: "templates-boilerplates", query: "\"portfolio template\" in:name,description fork:false archived:false stars:>10" },
  { category: "design-frontend", query: "topic:design-system fork:false archived:false stars:>25" },
  { category: "design-frontend", query: "topic:component-library fork:false archived:false stars:>20" },
  { category: "design-frontend", query: "topic:animation-library fork:false archived:false stars:>10" },
  { category: "design-frontend", query: "\"landing page\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "design-frontend", query: "topic:charts fork:false archived:false stars:>20" },
  { category: "design-frontend", query: "topic:ui-library fork:false archived:false stars:>20" },
  { category: "design-frontend", query: "topic:tailwindcss fork:false archived:false stars:>20" },
  { category: "design-frontend", query: "\"react components\" in:name,description fork:false archived:false stars:>20" },
  { category: "design-frontend", query: "\"motion library\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "design-frontend", query: "\"icon library\" in:name,description fork:false archived:false stars:>20" },
  { category: "design-frontend", query: "\"portfolio site\" in:name,description fork:false archived:false stars:>10" },
  { category: "design-frontend", query: "\"dashboard ui\" in:name,description fork:false archived:false stars:>10" },
  { category: "data-analytics", query: "topic:analytics fork:false archived:false stars:>30" },
  { category: "data-analytics", query: "topic:dashboard fork:false archived:false stars:>30" },
  { category: "data-analytics", query: "topic:etl fork:false archived:false stars:>15" },
  { category: "data-analytics", query: "topic:web-scraping fork:false archived:false stars:>20" },
  { category: "data-analytics", query: "\"realtime monitoring\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "data-analytics", query: "\"business intelligence\" in:name,description fork:false archived:false stars:>15" },
  { category: "data-analytics", query: "\"data pipeline\" in:name,description fork:false archived:false stars:>20" },
  { category: "data-analytics", query: "\"observability\" in:name,description fork:false archived:false stars:>20" },
  { category: "data-analytics", query: "\"reporting tool\" in:name,description fork:false archived:false stars:>10" },
  { category: "data-analytics", query: "\"log analysis\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "data-analytics", query: "\"web crawler\" in:name,description fork:false archived:false stars:>15" },
  { category: "data-analytics", query: "\"time series\" in:name,description fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "topic:seo fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "topic:keyword-research fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "\"marketing automation\" in:name,description fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "\"competitor analysis\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "marketing-seo-research", query: "\"content generation\" in:name,description fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "\"seo audit\" in:name,description fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "\"keyword tool\" in:name,description fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "\"social media analytics\" in:name,description fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "\"research automation\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "marketing-seo-research", query: "\"site audit\" in:name,description fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "\"content marketing\" in:name,description fork:false archived:false stars:>10" },
  { category: "marketing-seo-research", query: "\"social listening\" in:name,description fork:false archived:false stars:>10" },
  { category: "web3-blockchain", query: "topic:web3 fork:false archived:false stars:>20" },
  { category: "web3-blockchain", query: "topic:blockchain fork:false archived:false stars:>30" },
  { category: "web3-blockchain", query: "topic:smart-contracts fork:false archived:false stars:>20" },
  { category: "web3-blockchain", query: "topic:onchain-analytics fork:false archived:false stars:>10" },
  { category: "web3-blockchain", query: "topic:wallet fork:false archived:false stars:>20", sort: "updated" },
  { category: "web3-blockchain", query: "topic:defi fork:false archived:false stars:>15" },
  { category: "web3-blockchain", query: "topic:nft fork:false archived:false stars:>10" },
  { category: "web3-blockchain", query: "\"portfolio tracker\" in:name,description fork:false archived:false stars:>10" },
  { category: "web3-blockchain", query: "\"block explorer\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "web3-blockchain", query: "\"solidity toolkit\" in:name,description fork:false archived:false stars:>10" },
  { category: "web3-blockchain", query: "\"wallet connect\" in:name,description fork:false archived:false stars:>10" },
  { category: "web3-blockchain", query: "\"trading bot\" in:name,description fork:false archived:false stars:>10" },
  { category: "community-social", query: "topic:discord-bot fork:false archived:false stars:>20" },
  { category: "community-social", query: "topic:telegram-bot fork:false archived:false stars:>20" },
  { category: "community-social", query: "\"community analytics\" in:name,description fork:false archived:false stars:>10" },
  { category: "community-social", query: "\"leaderboard\" in:name,description fork:false archived:false stars:>20", sort: "updated" },
  { category: "community-social", query: "\"social listening\" in:name,description fork:false archived:false stars:>10" },
  { category: "community-social", query: "\"discord tool\" in:name,description fork:false archived:false stars:>10" },
  { category: "community-social", query: "\"community crm\" in:name,description fork:false archived:false stars:>10" },
  { category: "community-social", query: "\"event management\" in:name,description fork:false archived:false stars:>10" },
  { category: "community-social", query: "\"social feed\" in:name,description fork:false archived:false stars:>10" },
  { category: "community-social", query: "\"engagement bot\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "community-social", query: "\"moderation bot\" in:name,description fork:false archived:false stars:>10" },
  { category: "community-social", query: "\"community leaderboard\" in:name,description fork:false archived:false stars:>10" },
  { category: "gaming-interactive", query: "topic:godot fork:false archived:false stars:>20" },
  { category: "gaming-interactive", query: "topic:phaser fork:false archived:false stars:>10" },
  { category: "gaming-interactive", query: "\"interactive experience\" in:name,description fork:false archived:false stars:>10" },
  { category: "gaming-interactive", query: "\"game ui\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "gaming-interactive", query: "topic:simulation fork:false archived:false stars:>10" },
  { category: "gaming-interactive", query: "topic:unity fork:false archived:false stars:>10" },
  { category: "gaming-interactive", query: "\"game template\" in:name,description fork:false archived:false stars:>10" },
  { category: "gaming-interactive", query: "\"webgl\" in:name,description fork:false archived:false stars:>10" },
  { category: "gaming-interactive", query: "\"three.js\" in:name,description fork:false archived:false stars:>20" },
  { category: "gaming-interactive", query: "\"interactive story\" in:name,description fork:false archived:false stars:>10", sort: "updated" },
  { category: "gaming-interactive", query: "\"leaderboard game\" in:name,description fork:false archived:false stars:>10" }
];

export const bulkCategoryNarratives: Record<
  string,
  { contextualLabel: CuratedContextualLabel; contextualText: string }
> = {
  "ai-llm": {
    contextualLabel: "Why it matters",
    contextualText:
      "The useful AI repos are the ones builders can run, understand, and actually adapt into a product instead of only admire from a launch thread."
  },
  "agents-automation": {
    contextualLabel: "What it solves",
    contextualText:
      "Automation projects matter when they reduce repeated work in a way another builder can adapt, inspect, and trust."
  },
  "developer-tools": {
    contextualLabel: "Why it matters",
    contextualText:
      "Good developer tools change operator confidence and throughput, not just syntax or surface polish."
  },
  "templates-boilerplates": {
    contextualLabel: "Best for",
    contextualText:
      "Builders who want a concrete starting point that saves real time without hiding the structure they will need to own."
  },
  "design-frontend": {
    contextualLabel: "Best for",
    contextualText:
      "Frontend builders who want reusable systems they can borrow and ship, not just visual inspiration."
  },
  "data-analytics": {
    contextualLabel: "What it solves",
    contextualText:
      "Data tools earn attention when they turn raw collection, pipelines, and dashboards into something teams can actually operate."
  },
  "marketing-seo-research": {
    contextualLabel: "Best for",
    contextualText:
      "Founders and operators who want research and growth leverage from open-source systems instead of scattered spreadsheets."
  },
  "web3-blockchain": {
    contextualLabel: "Why it matters",
    contextualText:
      "Web3 tooling is most valuable when it makes contracts, wallets, or onchain data practical to inspect and ship with."
  },
  "community-social": {
    contextualLabel: "What it solves",
    contextualText:
      "Community tooling matters when it helps operators run engagement, moderation, or participation systems in repeatable ways."
  },
  "gaming-interactive": {
    contextualLabel: "Best for",
    contextualText:
      "Interactive projects are strongest when they expose reusable systems builders can turn into games, demos, or product experiences."
  }
};
