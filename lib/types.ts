export type ProjectStatus =
  | "pending"
  | "active"
  | "limited"
  | "featured"
  | "archived"
  | "removed";

export type ProjectSourceKind = "curated" | "imported" | "bulk";
export type DiscoveryTier = "indexed" | "qualified" | "curated";

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Creator = {
  id: string;
  slug: string;
  displayName: string;
  githubLogin: string;
  bio: string;
  avatarUrl?: string;
  websiteUrl?: string;
  specialties: string[];
  projectCount: number;
  followers: number;
  claimed: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  longDescription: string;
  contextualLabel: "Why it matters" | "Best for" | "What it solves";
  contextualText: string;
  status: ProjectStatus;
  statusLabel: string;
  claimed: boolean;
  creatorId: string;
  primaryCategory: string;
  tags: string[];
  language: string;
  githubUrl: string;
  githubFullName?: string;
  githubStars?: number;
  githubForks?: number;
  license?: string;
  demoUrl?: string;
  docsUrl?: string;
  updatedLabel: string;
  updatedAt: string;
  saves: number;
  likes: number;
  featuredInCollectionSlugs: string[];
  sourceKind?: ProjectSourceKind;
  discoveryTier?: DiscoveryTier;
  qualificationScore?: number;
};

export type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  editorName: string;
  tags: string[];
  projectSlugs: string[];
};

export type SearchResult = {
  kind: "project" | "creator" | "collection";
  title: string;
  slug: string;
  description: string;
};
