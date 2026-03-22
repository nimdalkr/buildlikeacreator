function includesAny(values: string[], needles: string[]) {
  return values.some((value) => needles.includes(value));
}

export function inferPrimaryCategoryFromSignals(
  topics: string[],
  language?: string | null,
  extraText?: string
) {
  const normalizedTopics = topics.map((topic) => topic.toLowerCase());
  const normalizedText = extraText?.toLowerCase() ?? "";
  const textIncludes = (needles: string[]) => needles.some((needle) => normalizedText.includes(needle));

  if (
    includesAny(normalizedTopics, ["llm", "rag", "chatbot", "prompt", "voice-ai", "vision", "ocr"]) ||
    textIncludes(["llm", "rag", "chat ui", "voice ai", "vision model", "ocr"])
  ) {
    return "ai-llm";
  }

  if (
    includesAny(normalizedTopics, [
      "agent",
      "agents",
      "automation",
      "workflow",
      "integration",
      "orchestration",
      "browser-automation"
    ]) ||
    textIncludes(["automation", "workflow", "browser automation", "agent orchestration"])
  ) {
    return "agents-automation";
  }

  if (
    includesAny(normalizedTopics, [
      "cli",
      "devtools",
      "developer-tools",
      "codegen",
      "debugging",
      "testing",
      "qa"
    ]) ||
    textIncludes(["cli", "developer tool", "testing framework", "debugging"])
  ) {
    return "developer-tools";
  }

  if (
    includesAny(normalizedTopics, [
      "starter",
      "template",
      "boilerplate",
      "saas-template",
      "admin-template"
    ]) ||
    textIncludes(["starter", "template", "boilerplate", "saas starter"])
  ) {
    return "templates-boilerplates";
  }

  if (
    includesAny(normalizedTopics, [
      "design-system",
      "component-library",
      "ui",
      "frontend",
      "animation",
      "tailwindcss"
    ]) ||
    textIncludes(["design system", "component library", "frontend ui", "animation library"])
  ) {
    return "design-frontend";
  }

  if (
    includesAny(normalizedTopics, [
      "analytics",
      "dashboard",
      "etl",
      "data-pipeline",
      "web-scraping",
      "monitoring"
    ]) ||
    textIncludes(["analytics", "dashboard", "etl", "monitoring", "crawler"])
  ) {
    return "data-analytics";
  }

  if (
    includesAny(normalizedTopics, [
      "seo",
      "keyword-research",
      "marketing",
      "content-marketing",
      "competitor-analysis"
    ]) ||
    textIncludes(["seo", "keyword research", "marketing automation", "competitor analysis"])
  ) {
    return "marketing-seo-research";
  }

  if (
    includesAny(normalizedTopics, [
      "web3",
      "blockchain",
      "wallet",
      "solidity",
      "smart-contracts",
      "defi"
    ]) ||
    textIncludes(["web3", "blockchain", "wallet", "smart contract", "defi"])
  ) {
    return "web3-blockchain";
  }

  if (
    includesAny(normalizedTopics, [
      "discord-bot",
      "telegram-bot",
      "community",
      "leaderboard",
      "social"
    ]) ||
    textIncludes(["discord bot", "telegram bot", "community tool", "social listening"])
  ) {
    return "community-social";
  }

  if (
    includesAny(normalizedTopics, ["godot", "unity", "phaser", "game", "simulation", "interactive"]) ||
    textIncludes(["game", "simulation", "interactive experience", "godot", "unity"])
  ) {
    return "gaming-interactive";
  }

  if (language?.toLowerCase() === "typescript") {
    return "developer-tools";
  }

  return "developer-tools";
}
