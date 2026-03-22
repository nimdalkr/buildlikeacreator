import { NextRequest, NextResponse } from "next/server";
import { invalidateCatalogCache, refreshCatalog } from "@/lib/catalog";
import { upsertImportedRepo } from "@/lib/catalog-store";
import { fetchGitHubRepository } from "@/lib/github";
import {
  findProjectByRepoUrl,
  getGitHubRepoFullName,
  normalizeGitHubRepoUrl
} from "@/lib/repo-import";
import { getSessionUser } from "@/lib/session";

function inferCategory(topics: string[], language?: string | null) {
  const normalizedTopics = topics.map((topic) => topic.toLowerCase());

  if (
    normalizedTopics.some((topic) =>
      ["llm", "rag", "chatbot", "prompt", "voice-ai", "vision", "ocr"].includes(topic)
    )
  ) {
    return "ai-llm";
  }

  if (
    normalizedTopics.some((topic) =>
      ["agent", "agents", "automation", "workflow", "integration", "orchestration", "browser-automation"].includes(topic)
    )
  ) {
    return "agents-automation";
  }

  if (
    normalizedTopics.some((topic) =>
      ["cli", "devtools", "developer-tools", "codegen", "debugging", "testing", "qa"].includes(topic)
    )
  ) {
    return "developer-tools";
  }

  if (
    normalizedTopics.some((topic) =>
      ["starter", "template", "boilerplate", "saas-template", "admin-template"].includes(topic)
    )
  ) {
    return "templates-boilerplates";
  }

  if (
    normalizedTopics.some((topic) =>
      ["design-system", "component-library", "ui", "frontend", "animation", "tailwindcss"].includes(topic)
    )
  ) {
    return "design-frontend";
  }

  if (
    normalizedTopics.some((topic) =>
      ["analytics", "dashboard", "etl", "data-pipeline", "web-scraping", "monitoring"].includes(topic)
    )
  ) {
    return "data-analytics";
  }

  if (
    normalizedTopics.some((topic) => ["starter", "template", "boilerplate"].includes(topic))
  ) {
    return "templates-boilerplates";
  }

  if (
    normalizedTopics.some((topic) =>
      ["seo", "keyword-research", "marketing", "content-marketing", "competitor-analysis"].includes(topic)
    )
  ) {
    return "marketing-seo-research";
  }

  if (
    normalizedTopics.some((topic) =>
      ["web3", "blockchain", "wallet", "solidity", "smart-contracts", "defi"].includes(topic)
    )
  ) {
    return "web3-blockchain";
  }

  if (
    normalizedTopics.some((topic) =>
      ["discord-bot", "telegram-bot", "community", "leaderboard", "social"].includes(topic)
    )
  ) {
    return "community-social";
  }

  if (
    normalizedTopics.some((topic) =>
      ["godot", "unity", "phaser", "game", "simulation", "interactive"].includes(topic)
    )
  ) {
    return "gaming-interactive";
  }

  if (language?.toLowerCase() === "typescript") {
    return "developer-tools";
  }

  return "developer-tools";
}

export async function POST(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Login is required before recommending a repo.",
        loginUrl: `/auth/login?next=${encodeURIComponent("/submit")}`
      },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    repoUrl?: string;
    context?: string;
    category?: string;
    claimIntent?: string;
  } | null;

  if (!body?.repoUrl) {
    return NextResponse.json(
      {
        error: "repoUrl is required"
      },
      { status: 400 }
    );
  }

  const canonicalUrl = normalizeGitHubRepoUrl(body.repoUrl);
  const repoFullName = getGitHubRepoFullName(body.repoUrl);
  if (!canonicalUrl) {
    return NextResponse.json(
      {
        accepted: false,
        error: "Please enter a valid public GitHub repository URL."
      },
      { status: 400 }
    );
  }

  const existingProject = await findProjectByRepoUrl(canonicalUrl);
  if (existingProject) {
    return NextResponse.json({
      accepted: true,
      authenticated: true,
      canonicalUrl,
      duplicate: true,
      projectSlug: existingProject.slug,
      status: existingProject.status,
      context:
        body.claimIntent === "creator"
          ? "This repo already exists. The correct next step is a creator claim, not a duplicate project page."
      : "This repo already exists. Your recommendation would attach to the canonical project instead of publishing a duplicate."
    });
  }

  if (!repoFullName) {
    return NextResponse.json(
      {
        accepted: false,
        error: "Could not resolve the GitHub repository owner/name pair."
      },
      { status: 400 }
    );
  }

  let snapshot;
  try {
    snapshot = await fetchGitHubRepository(repoFullName);
  } catch (error) {
    return NextResponse.json(
      {
        accepted: false,
        error:
          error instanceof Error
            ? error.message
            : "GitHub metadata could not be fetched for this repository."
      },
      { status: 502 }
    );
  }

  const primaryCategory =
    body.category ?? inferCategory(snapshot.repo.topics ?? [], snapshot.repo.language);

  await upsertImportedRepo({
    repoFullName: snapshot.repo.full_name,
    primaryCategory,
    contextualLabel: body.claimIntent === "creator" ? "Why it matters" : "What it solves",
    contextualText:
      body.context?.trim() ||
      snapshot.repo.description ||
      `${snapshot.repo.full_name} was imported from GitHub and is waiting for fuller editorial context.`,
    tags: (snapshot.repo.topics ?? []).slice(0, 5),
    claimIntent: body.claimIntent === "creator" ? "creator" : "recommend",
    submittedAt: new Date().toISOString(),
    submittedBy: sessionUser.githubLogin
  });

  await invalidateCatalogCache();
  await refreshCatalog();
  const importedProject = await findProjectByRepoUrl(snapshot.repo.html_url);

  return NextResponse.json(
    {
      accepted: true,
      authenticated: true,
      canonicalUrl,
      duplicate: false,
      context: body.context ?? snapshot.repo.description ?? null,
      category: primaryCategory,
      claimIntent: body.claimIntent ?? "recommend",
      status: importedProject?.status ?? "active",
      projectSlug: importedProject?.slug ?? null,
      repository: {
        fullName: snapshot.repo.full_name,
        stars: snapshot.repo.stargazers_count,
        forks: snapshot.repo.forks_count,
        language: snapshot.repo.language,
        pushedAt: snapshot.repo.pushed_at
      }
    },
    { status: 202 }
  );
}
