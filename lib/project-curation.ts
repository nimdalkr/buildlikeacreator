import type {
  ProjectDifficulty,
  ProjectInstallDifficulty,
  ProjectProductionReadiness
} from "@/lib/types";

type DeriveProjectCurationInput = {
  title: string;
  summary: string;
  primaryCategory: string;
  tags: string[];
  language: string;
  githubStars?: number;
  githubForks?: number;
  demoUrl?: string;
  docsUrl?: string;
  license?: string;
  updatedAt: string;
};

type ProjectCurationMetadata = {
  subcategories: string[];
  audienceTags: string[];
  useCaseTags: string[];
  formatTags: string[];
  difficulty: ProjectDifficulty;
  maintenanceTag: string;
  licenseTag: string;
  badges: string[];
  recommendedFor: string;
  strengths: string[];
  caveats: string[];
  installDifficulty: ProjectInstallDifficulty;
  productionReadiness: ProjectProductionReadiness;
};

function textIncludesAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function getStaleDays(input: string) {
  const target = new Date(input);
  if (Number.isNaN(target.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(0, Math.floor((Date.now() - target.getTime()) / (1000 * 60 * 60 * 24)));
}

function uniqueStrings(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

function inferFormats(text: string) {
  const formats = new Set<string>();

  if (textIncludesAny(text, ["cli", "command line"])) formats.add("CLI");
  if (textIncludesAny(text, ["sdk"])) formats.add("SDK");
  if (textIncludesAny(text, ["api", "rest", "graphql"])) formats.add("API");
  if (textIncludesAny(text, ["library", "framework"])) formats.add("Library");
  if (textIncludesAny(text, ["template", "boilerplate", "starter"])) formats.add("Template");
  if (textIncludesAny(text, ["bot", "discord bot", "telegram bot"])) formats.add("Bot");
  if (textIncludesAny(text, ["chrome extension", "browser extension"])) {
    formats.add("Browser Extension");
  }

  if (formats.size === 0) {
    formats.add("Web App");
  }

  return [...formats].slice(0, 3);
}

function inferDifficulty(text: string, stars: number, docsUrl?: string): ProjectDifficulty {
  if (
    textIncludesAny(text, ["starter", "template", "beginner", "ui kit", "chat ui"]) &&
    Boolean(docsUrl)
  ) {
    return "Beginner-friendly";
  }

  if (
    textIncludesAny(text, ["infra", "blockchain", "smart contract", "benchmark", "compiler"]) ||
    stars < 100
  ) {
    return "Advanced";
  }

  return "Intermediate";
}

function inferInstallDifficulty(text: string, docsUrl?: string, demoUrl?: string): ProjectInstallDifficulty {
  if (demoUrl && docsUrl && textIncludesAny(text, ["template", "ui", "starter", "chat"])) {
    return "Easy";
  }

  if (textIncludesAny(text, ["infra", "kubernetes", "blockchain", "self-hosted", "distributed"])) {
    return "Complex";
  }

  return "Moderate";
}

function inferProductionReadiness(stars: number, staleDays: number, docsUrl?: string): ProjectProductionReadiness {
  if (stars >= 2000 && staleDays <= 90 && docsUrl) {
    return "Ready for production";
  }

  if (stars >= 300 && staleDays <= 180) {
    return "Good for MVPs";
  }

  if (stars >= 50) {
    return "Great for learning";
  }

  return "Research-heavy";
}

function inferMaintenanceTag(stars: number, staleDays: number) {
  if (staleDays <= 90) {
    return "Actively maintained";
  }

  if (staleDays <= 180) {
    return "Recently updated";
  }

  if (staleDays <= 365) {
    return "Maintenance slowing";
  }

  return "Archive caution";
}

function inferSubcategories(category: string, text: string) {
  const rules: Record<string, string[]> = {
    "ai-llm": [
      textIncludesAny(text, ["chat", "assistant", "chat ui"]) ? "Chatbots / Chat UI" : "",
      textIncludesAny(text, ["rag", "retrieval", "search", "document qa"]) ? "RAG / Search" : "",
      textIncludesAny(text, ["agent", "orchestration"]) ? "Agent Frameworks" : "",
      textIncludesAny(text, ["voice", "audio", "speech"]) ? "Voice AI" : "",
      textIncludesAny(text, ["vision", "image", "ocr"]) ? "Vision / OCR" : ""
    ],
    "agents-automation": [
      textIncludesAny(text, ["browser", "playwright", "puppeteer"]) ? "Web Automation" : "",
      textIncludesAny(text, ["workflow", "schedule", "trigger"]) ? "Scheduling / Trigger Automation" : "",
      textIncludesAny(text, ["orchestration", "agent"]) ? "Agent Orchestration" : "",
      textIncludesAny(text, ["scraping", "crawl", "collect"]) ? "Data Collection Automation" : "",
      "Work Automation"
    ],
    "developer-tools": [
      textIncludesAny(text, ["cli"]) ? "CLI Tools" : "",
      textIncludesAny(text, ["test", "qa", "browser testing"]) ? "Test Automation" : "",
      textIncludesAny(text, ["docs", "documentation"]) ? "Documentation Tools" : "",
      textIncludesAny(text, ["lint", "quality", "analysis"]) ? "Repository Analysis" : "",
      "Code Generation"
    ],
    "templates-boilerplates": [
      textIncludesAny(text, ["saas"]) ? "SaaS Boilerplates" : "",
      textIncludesAny(text, ["dashboard", "admin"]) ? "Dashboard Templates" : "",
      textIncludesAny(text, ["auth", "stripe", "payment"]) ? "Auth / Billing Starters" : "",
      textIncludesAny(text, ["ai"]) ? "AI App Starters" : "",
      "Starter Foundations"
    ],
    "design-frontend": [
      textIncludesAny(text, ["component", "ui kit"]) ? "UI Component Libraries" : "",
      textIncludesAny(text, ["design system"]) ? "Design Systems" : "",
      textIncludesAny(text, ["animation", "motion"]) ? "Animation / Interaction" : "",
      textIncludesAny(text, ["chart", "visualization"]) ? "Charts / Visualization UI" : "",
      "Frontend UI"
    ],
    "data-analytics": [
      textIncludesAny(text, ["crawl", "scrap", "collect"]) ? "Data Collection / Crawling" : "",
      textIncludesAny(text, ["etl", "pipeline", "workflow"]) ? "ETL / Pipelines" : "",
      textIncludesAny(text, ["dashboard", "analytics"]) ? "Dashboards" : "",
      textIncludesAny(text, ["chart", "grafana", "superset"]) ? "Charts / Visualization" : "",
      "Monitoring / Reporting"
    ],
    "marketing-seo-research": [
      textIncludesAny(text, ["seo"]) ? "SEO Analysis" : "",
      textIncludesAny(text, ["keyword"]) ? "Keyword Research" : "",
      textIncludesAny(text, ["content"]) ? "Content Support" : "",
      textIncludesAny(text, ["competitor", "research"]) ? "Competitor Research" : "",
      "Marketing Automation"
    ],
    "web3-blockchain": [
      textIncludesAny(text, ["wallet"]) ? "Wallet / Accounts" : "",
      textIncludesAny(text, ["onchain", "analytics", "indexer"]) ? "Onchain Analytics" : "",
      textIncludesAny(text, ["contract", "solidity", "hardhat", "remix"]) ? "Smart Contract Tooling" : "",
      textIncludesAny(text, ["defi", "trading"]) ? "Trading / DeFi" : "",
      "Web3 Infrastructure"
    ],
    "community-social": [
      textIncludesAny(text, ["discord"]) ? "Discord Tools" : "",
      textIncludesAny(text, ["telegram"]) ? "Telegram Tools" : "",
      textIncludesAny(text, ["leaderboard", "points"]) ? "Leaderboards / Points" : "",
      textIncludesAny(text, ["social", "feed", "listening"]) ? "Social Listening" : "",
      "Community Operations"
    ],
    "gaming-interactive": [
      textIncludesAny(text, ["godot", "unity", "phaser"]) ? "Game Templates / Engine Examples" : "",
      textIncludesAny(text, ["simulation"]) ? "Simulation Tools" : "",
      textIncludesAny(text, ["leaderboard", "ranking"]) ? "Rankings / Leaderboards" : "",
      textIncludesAny(text, ["three", "interactive", "webgl"]) ? "Interactive Web Experiences" : "",
      "Game UI / Tooling"
    ]
  };

  return uniqueStrings(rules[category] ?? []).slice(0, 2);
}

function inferRecommendedFor(category: string, text: string) {
  const defaults: Record<string, string> = {
    "ai-llm": "Builders exploring AI features they can actually ship or study",
    "agents-automation": "Operators and builders automating repeated work across apps and APIs",
    "developer-tools": "Developers who want faster local workflows, better quality gates, or sharper debugging",
    "templates-boilerplates": "Founders and builders who need a faster path to an MVP",
    "design-frontend": "Frontend builders and designers shaping polished product surfaces",
    "data-analytics": "Teams that need dashboards, pipelines, or monitoring they can inspect and extend",
    "marketing-seo-research": "Marketers and founders who want automation and research leverage",
    "web3-blockchain": "Web3 builders shipping wallets, analytics, contract, or onchain tooling",
    "community-social": "Community managers and product teams running engagement systems",
    "gaming-interactive": "Game and interactive builders prototyping playable or visual experiences"
  };

  if (textIncludesAny(text, ["beginner", "starter", "template", "easy"])) {
    return "Beginners and solo builders who want to try a working project quickly";
  }

  return defaults[category] ?? "Developers looking for practical open-source building blocks";
}

function inferUseCases(category: string, text: string) {
  const common = ["Learning", "Real work", "MVP building"];
  const categorySpecific: Record<string, string[]> = {
    "ai-llm": ["AI feature prototyping", "Knowledge tools"],
    "agents-automation": ["Ops automation", "Workflow automation"],
    "developer-tools": ["Developer workflow", "Code quality"],
    "templates-boilerplates": ["SaaS MVPs", "Hackathons"],
    "design-frontend": ["Frontend delivery", "Portfolio work"],
    "data-analytics": ["Dashboards", "Reporting"],
    "marketing-seo-research": ["Research automation", "SEO operations"],
    "web3-blockchain": ["dApp MVPs", "Onchain dashboards"],
    "community-social": ["Community ops", "Moderation support"],
    "gaming-interactive": ["Playable prototypes", "Interactive demos"]
  };

  if (textIncludesAny(text, ["hackathon"])) {
    common.push("Hackathons");
  }

  return uniqueStrings([...common, ...(categorySpecific[category] ?? [])]).slice(0, 4);
}

function inferAudience(category: string, text: string) {
  const base = ["Developers"];

  if (textIncludesAny(text, ["founder", "saas", "mvp"])) base.push("Founders");
  if (textIncludesAny(text, ["no-code", "automation"])) base.push("Vibe coders");
  if (textIncludesAny(text, ["design", "ui", "frontend"])) base.push("Designers");
  if (category === "marketing-seo-research") base.push("Marketers");
  if (category === "community-social") base.push("Community managers");
  if (category === "web3-blockchain") base.push("Web3 users");

  return uniqueStrings(base).slice(0, 3);
}

export function deriveProjectCurationMetadata(
  input: DeriveProjectCurationInput
): ProjectCurationMetadata {
  const text = [
    input.title,
    input.summary,
    input.primaryCategory,
    input.language,
    ...input.tags
  ]
    .join(" ")
    .toLowerCase();
  const stars = input.githubStars ?? 0;
  const forks = input.githubForks ?? 0;
  const staleDays = getStaleDays(input.updatedAt);
  const difficulty = inferDifficulty(text, stars, input.docsUrl);
  const installDifficulty = inferInstallDifficulty(text, input.docsUrl, input.demoUrl);
  const productionReadiness = inferProductionReadiness(stars, staleDays, input.docsUrl);
  const maintenanceTag = inferMaintenanceTag(stars, staleDays);
  const subcategories = inferSubcategories(input.primaryCategory, text);
  const badges = uniqueStrings([
    input.demoUrl ? "Demo available" : undefined,
    input.docsUrl ? "Well documented" : undefined,
    staleDays <= 90 ? "Actively maintained" : undefined,
    installDifficulty === "Easy" ? "Easy setup" : undefined,
    difficulty === "Beginner-friendly" ? "Beginner-friendly" : undefined,
    productionReadiness === "Ready for production" ? "Production-ready" : undefined,
    productionReadiness === "Good for MVPs" ? "Great for MVPs" : undefined,
    stars >= 5000 ? "Star momentum" : undefined,
    textIncludesAny(text, ["automation", "agent", "template", "builder"]) ? "Vibe-coder friendly" : undefined,
    installDifficulty === "Complex" ? "Setup is complex" : undefined,
    productionReadiness === "Research-heavy" ? "Better for reference than production" : undefined
  ]).slice(0, 5);

  const strengths = uniqueStrings([
    input.docsUrl ? "Has documentation or a clear README entry point" : undefined,
    input.demoUrl ? "Lets people try the product before installing" : undefined,
    stars >= 1000 ? "Shows strong developer adoption on GitHub" : undefined,
    forks >= 150 ? "Has visible fork and reuse activity" : undefined,
    staleDays <= 90 ? "Recent maintenance signals are still active" : undefined,
    input.license && input.license !== "NOASSERTION" ? `Clear ${input.license} license` : undefined
  ]).slice(0, 4);

  const caveats = uniqueStrings([
    !input.demoUrl ? "No live demo link surfaced yet" : undefined,
    !input.docsUrl ? "Documentation quality still needs manual review" : undefined,
    staleDays > 180 ? "Maintenance looks slower than the top active projects" : undefined,
    installDifficulty === "Complex" ? "Setup is likely heavier than it first appears" : undefined,
    productionReadiness === "Research-heavy"
      ? "Looks more exploratory than production-ready right now"
      : undefined
  ]).slice(0, 3);

  return {
    subcategories,
    audienceTags: inferAudience(input.primaryCategory, text),
    useCaseTags: inferUseCases(input.primaryCategory, text),
    formatTags: inferFormats(text),
    difficulty,
    maintenanceTag,
    licenseTag: input.license && input.license !== "NOASSERTION" ? input.license : "Custom / Unknown",
    badges,
    recommendedFor: inferRecommendedFor(input.primaryCategory, text),
    strengths,
    caveats,
    installDifficulty,
    productionReadiness
  };
}
