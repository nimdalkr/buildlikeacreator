import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ImportedRepoSource } from "@/lib/curated-github-sources";

const DATA_DIR = path.join(process.cwd(), "data");
const IMPORTED_REPOS_PATH = path.join(DATA_DIR, "imported-repos.json");
const CATALOG_CACHE_PATH = path.join(DATA_DIR, "catalog-cache.json");
const HARVEST_STATE_PATH = path.join(DATA_DIR, "catalog-harvest-state.json");

export type CatalogHarvestState = {
  bulkQueryOffset: number;
  lastRunAt?: string;
};

export async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, value: unknown) {
  await ensureDataDir();
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

export async function readImportedRepos() {
  return readJsonFile<ImportedRepoSource[]>(IMPORTED_REPOS_PATH, []);
}

export async function upsertImportedRepo(entry: ImportedRepoSource) {
  const existing = await readImportedRepos();
  const filtered = existing.filter(
    (candidate) => candidate.repoFullName.toLowerCase() !== entry.repoFullName.toLowerCase()
  );
  filtered.unshift(entry);
  await writeJsonFile(IMPORTED_REPOS_PATH, filtered);
}

export type CatalogCachePayload<T> = {
  generatedAt: string;
  data: T;
};

export async function readCatalogCache<T>() {
  return readJsonFile<CatalogCachePayload<T> | null>(CATALOG_CACHE_PATH, null);
}

export async function writeCatalogCache<T>(data: T) {
  await writeJsonFile(CATALOG_CACHE_PATH, {
    generatedAt: new Date().toISOString(),
    data
  } satisfies CatalogCachePayload<T>);
}

export async function readCatalogHarvestState() {
  return readJsonFile<CatalogHarvestState>(HARVEST_STATE_PATH, {
    bulkQueryOffset: 0
  });
}

export async function writeCatalogHarvestState(state: CatalogHarvestState) {
  await writeJsonFile(HARVEST_STATE_PATH, state);
}
