# Backend/Data MVP Spec

This document is the MVP data contract for the curation layer. It is intentionally not a GitHub replacement and it does not model a workflow/build-log product surface.

## 1. Data model overview

### Core rules

- One canonical `Repository` row per public GitHub repo, deduped by `github_repository_id` first and canonical URL second.
- One `Project` row wraps one canonical repository and is the discoverable curation object.
- `Submitter` and `Creator` are separate identities.
- A project can be recommended by any logged-in GitHub user.
- A creator can claim a project later and become the public `claimed_creator`.
- Collections in MVP are editorial only. No user-generated collections.
- Visibility is status- and score-based. Submission order never affects browse/search rank.

### Entity roles

| Entity | Purpose | Key ownership rule |
| --- | --- | --- |
| `users` | Authenticated platform users via GitHub login | One row per GitHub account |
| `creators` | Public creator profile | May be unclaimed at first, then linked to a user |
| `repositories` | Canonical GitHub repo record | One row per repo ID |
| `projects` | Curated public project surface | References exactly one repository |
| `project_submissions` | Recommendation / import trace | Stores submitter separately from creator |
| `project_creator_claims` | Claim workflow | Captures evidence and approval history |
| `collections` | Editorial lists | Editor-owned only |
| `collection_items` | Ordered collection membership | Manual editorial ordering |
| `project_likes`, `project_saves`, `builder_follows` | Engagement primitives | One action row per user/object pair |
| `categories` | Browse taxonomy | Stable slugs, limited hierarchy |
| `project_scores` | Materialized rank state | Recomputed by job |
| `repository_sync_runs` | Ingestion/sync audit | Needed for debugging and retries |

### Status model

`projects.status`:

- `draft`
- `pending`
- `active`
- `limited`
- `featured`
- `archived`
- `removed`

Operational meaning:

- `pending`: visible only to editors/admins and claim/review flows.
- `active`: visible in browse/search if score threshold is met.
- `limited`: visible, but reduced distribution due to weak metadata, stale repo, or broken links.
- `featured`: editorial boost and explicit placement eligibility.
- `archived` and `removed`: hidden from normal discovery.

### Minimal relationships

- `users` 1:1 `creators` only when a creator is claimed.
- `repositories` 1:1 `projects`.
- `projects` 1:many `project_submissions`.
- `projects` 1:many `project_creator_claims`.
- `projects` many:many `categories`.
- `projects` many:many `collections` via `collection_items`.
- `users` many:many `projects` via `project_likes` and `project_saves`.
- `users` many:many `creators` via `builder_follows`.

## 2. DB schema draft

Postgres-friendly draft. UUIDs for platform rows, bigint for GitHub IDs.

```sql
create type project_status as enum (
  'draft', 'pending', 'active', 'limited', 'featured', 'archived', 'removed'
);

create type claim_status as enum (
  'requested', 'approved', 'rejected', 'withdrawn'
);

create type collection_kind as enum (
  'editorial'
);

create type link_kind as enum (
  'github', 'demo', 'docs'
);

create type repo_health_status as enum (
  'unknown', 'healthy', 'degraded', 'broken'
);
```

### `users`

- `id uuid pk`
- `github_user_id bigint unique not null`
- `github_login text unique not null`
- `display_name text not null`
- `avatar_url text null`
- `bio text null`
- `website_url text null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `creators`

- `id uuid pk`
- `slug text unique not null`
- `display_name text not null`
- `bio text null`
- `avatar_url text null`
- `website_url text null`
- `github_login text null`
- `claimed_by_user_id uuid unique null references users(id)`
- `claim_status claim_status not null default 'requested'`
- `claimed_at timestamptz null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `repositories`

- `id uuid pk`
- `github_repository_id bigint unique not null`
- `canonical_url text unique not null`
- `owner_login text not null`
- `name text not null`
- `full_name text unique not null`
- `description text null`
- `homepage_url text null`
- `default_branch text null`
- `primary_language text null`
- `license_spdx text null`
- `topics text[] not null default '{}'`
- `stars_count int not null default 0`
- `forks_count int not null default 0`
- `watchers_count int not null default 0`
- `open_issues_count int not null default 0`
- `is_fork boolean not null default false`
- `is_archived boolean not null default false`
- `is_private boolean not null default false`
- `pushed_at timestamptz null`
- `created_at_github timestamptz null`
- `last_synced_at timestamptz null`
- `sync_status text not null default 'unknown'`
- `health_status repo_health_status not null default 'unknown'`
- `metadata_completeness_score int not null default 0`
- `stale_days int not null default 0`
- `broken_link_count int not null default 0`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `projects`

- `id uuid pk`
- `repository_id uuid unique not null references repositories(id)`
- `slug text unique not null`
- `title text not null`
- `summary text null`
- `long_description text null`
- `status project_status not null default 'pending'`
- `submitter_user_id uuid not null references users(id)`
- `claimed_creator_id uuid null references creators(id)`
- `primary_category_id uuid null references categories(id)`
- `demo_url text null`
- `docs_url text null`
- `github_url text not null`
- `submitted_at timestamptz not null`
- `published_at timestamptz null`
- `featured_at timestamptz null`
- `archived_at timestamptz null`
- `removed_at timestamptz null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `project_submissions`

- `id uuid pk`
- `project_id uuid null references projects(id)`
- `repository_id uuid not null references repositories(id)`
- `submitter_user_id uuid not null references users(id)`
- `source_url text not null`
- `note text null`
- `submission_source text not null default 'manual'`
- `sync_status text not null default 'pending_sync'`
- `resolution_status text not null default 'unresolved'`
- `resolved_at timestamptz null`
- `duplicate_of_project_id uuid null references projects(id)`
- `created_at timestamptz not null`

Purpose: preserve recommendation provenance and let the platform dedupe without losing submitter context.

### `project_creator_claims`

- `id uuid pk`
- `project_id uuid not null references projects(id)`
- `creator_id uuid not null references creators(id)`
- `claimant_user_id uuid not null references users(id)`
- `status claim_status not null default 'requested'`
- `evidence_url text null`
- `notes text null`
- `reviewed_by_user_id uuid null references users(id)`
- `reviewed_at timestamptz null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `categories`

- `id uuid pk`
- `slug text unique not null`
- `name text not null`
- `description text null`
- `parent_id uuid null references categories(id)`
- `sort_order int not null default 0`
- `is_active boolean not null default true`

### `project_categories`

- `project_id uuid not null references projects(id)`
- `category_id uuid not null references categories(id)`
- `primary boolean not null default false`
- primary key: `(project_id, category_id)`

### `collections`

- `id uuid pk`
- `kind collection_kind not null default 'editorial'`
- `slug text unique not null`
- `title text not null`
- `description text null`
- `editor_user_id uuid not null references users(id)`
- `status text not null default 'published'`
- `published_at timestamptz null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `collection_items`

- `collection_id uuid not null references collections(id)`
- `project_id uuid not null references projects(id)`
- `sort_order int not null`
- `note text null`
- primary key: `(collection_id, project_id)`

### `project_likes`

- `user_id uuid not null references users(id)`
- `project_id uuid not null references projects(id)`
- `created_at timestamptz not null`
- primary key: `(user_id, project_id)`

### `project_saves`

- `user_id uuid not null references users(id)`
- `project_id uuid not null references projects(id)`
- `created_at timestamptz not null`
- primary key: `(user_id, project_id)`

### `builder_follows`

- `user_id uuid not null references users(id)`
- `creator_id uuid not null references creators(id)`
- `created_at timestamptz not null`
- primary key: `(user_id, creator_id)`

### `project_scores`

- `project_id uuid pk references projects(id)`
- `visibility_score int not null default 0`
- `quality_score int not null default 0`
- `engagement_score int not null default 0`
- `freshness_score int not null default 0`
- `editorial_score int not null default 0`
- `search_score int not null default 0`
- `status_gate_score int not null default 0`
- `score_version int not null default 1`
- `signals jsonb not null default '{}'`
- `last_calculated_at timestamptz not null`

### `repository_sync_runs`

- `id uuid pk`
- `repository_id uuid not null references repositories(id)`
- `run_type text not null`
- `status text not null`
- `started_at timestamptz not null`
- `finished_at timestamptz null`
- `error_code text null`
- `error_message text null`
- `github_rate_limit_remaining int null`
- `payload jsonb not null default '{}'`

### Indexes and constraints

- Unique on `repositories.github_repository_id`
- Unique on `repositories.canonical_url`
- Unique on `projects.repository_id`
- Unique on `users.github_user_id`
- Unique on `users.github_login`
- Unique on `creators.slug`
- Unique on `projects.slug`
- Unique partial index for `projects.status in ('active','limited','featured')` plus `project_scores.search_score desc`
- GIN `tsvector` index on `projects.title`, `projects.summary`, `repositories.description`, `repositories.topics`, `creators.display_name`
- B-tree indexes on `projects.primary_category_id`, `projects.claimed_creator_id`, `projects.status`, `repositories.last_synced_at`, `repositories.health_status`
- Composite indexes on `collection_items.collection_id, collection_items.sort_order` and `project_categories.category_id`

## 3. GitHub ingestion flow

### Import/register flow

1. User submits a public GitHub repo URL or owner/repo pair.
2. Normalize to canonical GitHub URL.
3. Call GitHub API to resolve `repository_id`.
4. If `github_repository_id` already exists, reuse the existing `repositories` row and attach a new `project_submissions` record.
5. If not found, create `repositories`, then create a `projects` row with `status = pending`.
6. Store the submitter as `project.submitter_user_id` and `project_submissions.submitter_user_id`.
7. Create a `repository_sync_runs` row for audit.
8. Queue metadata sync immediately.

### Canonicalization rules

- Strip trailing `.git`.
- Lowercase owner and repo names.
- Resolve redirects and repository renames to the current GitHub canonical URL.
- Reject private repos for MVP.
- Reject non-GitHub sources for MVP.

### Dedupe rules

- Primary key is GitHub repository ID.
- If GitHub ID is unavailable during intake, use canonical URL match temporarily.
- On later sync, merge by GitHub ID and collapse duplicate project submissions onto the canonical project.

### Sync output

- Repository facts: stars, forks, watchers, language, topics, license, default branch, archive state, push time.
- Project facts: title, summary, link fields, category hints, status.
- Health facts: broken links, stale days, completeness score.

### Failure handling

- Temporary GitHub API failure: keep the submission in `pending_sync`.
- Repo not reachable or deleted: mark repository `health_status = broken`, project `status = limited` or `archived` depending on severity.
- Missing metadata: do not block creation; downgrade score and optionally route to editor review.

## 4. Metadata sync flow

### Sync sources

- GitHub repository API
- GitHub languages API
- GitHub topics
- Optional manual fields from submitter/editor
- Link health checks for `github_url`, `demo_url`, `docs_url`

### Sync cadence

- New imports: immediate sync.
- Active/featured projects: refresh every 6 to 12 hours.
- Limited/archived projects: refresh daily or weekly depending on status.
- Broken repos: retry with exponential backoff, then reduce cadence.

### Sync pipeline

1. Fetch repo by `github_repository_id`.
2. Upsert canonical repository fields.
3. Recompute link health for GitHub/demo/docs URLs.
4. Recompute metadata completeness.
5. Detect staleness from `pushed_at`.
6. Update project status only if the repo state changes enough to justify it.
7. Write a `repository_sync_runs` record with success or failure details.

### Health checks

- `github_url`: must resolve to the canonical repo URL.
- `demo_url`: HTTP 200 or valid redirect chain; non-2xx becomes degraded/broken.
- `docs_url`: HTTP 200 or valid redirect chain; non-2xx becomes degraded/broken.
- Repo activity: if `pushed_at` is older than the stale threshold, mark stale.

### Completeness scoring inputs

- Repo description present
- Homepage/demo/docs URLs present
- Topics present
- Primary language present
- License present
- Category assigned
- Creator claimed or linked
- Broken link count
- Recent activity

### No README summary policy

- Do not generate or store README summaries for MVP.
- README text may be fetched only for technical validation or URL discovery, not for content generation in the product surface.

## 5. API endpoint list

### Auth

- `GET /auth/github/start`
- `GET /auth/github/callback`
- `POST /auth/logout`
- `GET /me`

### Project intake

- `POST /projects/import`
- `POST /projects/recommend`
- `POST /projects/:id/claim`
- `POST /projects/:id/unclaim`
- `PATCH /projects/:id`
- `GET /projects/:id`
- `GET /projects/:slug`

### Browse and search

- `GET /projects`
- `GET /browse/categories`
- `GET /browse/categories/:slug`
- `GET /search?q=...`
- `GET /collections`
- `GET /collections/:slug`

### Creator profiles

- `GET /creators/:slug`
- `GET /creators/:slug/projects`
- `PATCH /creators/me`
- `POST /creators/:id/claim`
- `POST /creators/:id/follow`
- `DELETE /creators/:id/follow`

### Engagement

- `POST /projects/:id/like`
- `DELETE /projects/:id/like`
- `POST /projects/:id/save`
- `DELETE /projects/:id/save`

### Editorial admin

- `POST /admin/collections`
- `PATCH /admin/collections/:id`
- `POST /admin/collections/:id/items`
- `DELETE /admin/collections/:id/items/:projectId`
- `POST /admin/projects/:id/status`
- `POST /admin/projects/:id/reindex`
- `POST /admin/repositories/:id/sync`

### Webhook / job endpoints

- `POST /webhooks/github` only if a future GitHub App is added
- `POST /jobs/sync/repositories`
- `POST /jobs/recompute-scores`

### Query behavior

- `GET /projects` must support filters for category, status, creator, language, featured, stale, and sort mode.
- `GET /search` must rank by lexical relevance plus score, not by submission time.
- `GET /browse/categories/:slug` must be score-ordered within the category.

## 6. Ranking/score job design

### Job cadence

- Incremental score refresh every 15 minutes for active and featured projects.
- Full recompute daily for all projects.
- Reindex search after score refresh.

### Score gates

Projects are eligible for discovery only if:

- `status` is `active`, `limited`, or `featured`
- repository is public and canonicalized
- not flagged `removed`
- not duplicate of a better canonical project

### Score components

Use a 0-100 model:

- `quality_score` 0-35
- `engagement_score` 0-20
- `freshness_score` 0-15
- `editorial_score` 0-15
- `status_gate_score` 0-15

### Quality score formula

- +8 if description exists and is non-trivial
- +6 if topics are present
- +5 if primary language exists
- +5 if license exists
- +5 if docs URL exists and resolves
- +5 if demo URL exists and resolves
- +2 if creator is claimed
- -10 if broken GitHub/demo/docs link exists
- -10 if metadata is thin or incomplete

### Engagement score formula

- Weighted likes, saves, and creator follows.
- Use logarithmic dampening to prevent early whales from dominating.
- Decay old engagement slightly so the list does not freeze.

Example:

- `likes_weight = log(1 + likes) * 6`
- `saves_weight = log(1 + saves) * 8`
- `follows_weight = log(1 + creator_follows) * 4`

### Freshness score formula

- Recent push activity increases score.
- Stale repos reduce score progressively.
- Very old repos can still remain visible if editorially featured, but with a capped freshness score.

Example:

- `pushed_within_14_days -> 15`
- `pushed_within_90_days -> 10`
- `pushed_within_365_days -> 5`
- `older -> 0 to 4 depending on category and engagement`

### Editorial score formula

- Collection inclusion grants a boost.
- Featured editorial placement adds more than simple collection inclusion.
- Collections only affect visible ranking; they do not change ownership or creator identity.

### Search scoring

Final search order should combine:

- lexical match on title, summary, repo description, category, creator name, and topics
- `search_score`
- status gate
- category match boost
- featured boost

### Output materialization

- Persist the component scores in `project_scores`.
- Persist the derived `search_score` for query-time filtering.
- Keep `signals` JSON for debugging and score explainability.

### Downranking rules

- Broken links downrank immediately.
- Stale repos downrank progressively.
- Thin metadata downranks until corrected.
- Duplicate or near-duplicate projects should show the canonical record only.

## 7. Technical risks

- GitHub repo dedupe can be wrong if canonical URLs are stale or renamed; GitHub ID must be the source of truth as soon as it is available.
- Claim flow can be abused if creator verification is weak; claims need a manual or GitHub-identity-based proof step.
- Search quality will suffer if metadata is thin; the MVP must tolerate incomplete repos but visibly downrank them.
- Popularity bias can overwhelm discoverability; scoring must dampen raw stars and likes.
- Broken links and stale repos will accumulate quickly without automated sync; this is a required background job, not a nice-to-have.
- Editorial collections can become a hidden maintenance burden if no tooling exists to reorder and prune them.
- API rate limits from GitHub can stall ingestion; caching and retry policy are mandatory.
- Search and browse need separate ranking behavior; otherwise editorial curation will get buried behind lexical matches.
- The model must keep submitter identity distinct from claimed creator identity or attribution will become ambiguous.
- If project status transitions are not audited, it will be impossible to explain why a project disappeared from browse/search.
