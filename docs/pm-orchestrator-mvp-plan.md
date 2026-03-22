# PM Orchestrator MVP Plan

Source specs: [UX_UI_SPEC.md](../UX_UI_SPEC.md) and [docs/backend-data-mvp.md](./backend-data-mvp.md).

## 1. Master Plan

Ship a creator-first discovery MVP that imports public GitHub repos, dedupes them canonically, and presents them as curated projects with creator context before repo links. The product must optimize for discoverability, curation, context, and reuse, while avoiding any GitHub-replacement behavior, README-summary behavior, or workflow/build-log surfaces.

The build should land in this order:
1. Auth and identity separation.
2. Repository intake, dedupe, and sync.
3. Project browsing, search, and detail surfaces.
4. Creator profiles and follow/save/like primitives.
5. Editorial collections and ranking.
6. Claim flow, claim safeguards, and moderation/status transitions.

The MVP is done when a logged-in GitHub user can recommend a public repo, the system can canonicalize and score it, and another user can discover it through Explore, Creators, Collections, or Saved with clear creator context and status-aware ranking.

## 2. Workstream Breakdown

### Product and IA
Define the page-level navigation and content hierarchy around Explore, Creators, Collections, and Saved. Enforce creator-first ordering on cards and detail pages, with a single required contextual field per project.

### Identity and Auth
Implement GitHub login only. Keep submitter identity separate from claimed creator identity in the schema and in the UI. Support follow/save/like as logged-in user actions only.

### Ingestion and Canonicalization
Build repo import/register for public GitHub repos only. Resolve owner/repo or URL to canonical GitHub repository ID, dedupe by GitHub ID first and canonical URL second, and create a submission record even when the project already exists.

### Discovery and Ranking
Implement browse/search surfaces that rank by lexical relevance plus score, not submission time. Apply status gates, freshness, metadata completeness, and broken-link penalties so stale or thin projects fall behind.

### Creator Profiles and Claims
Create public creator pages, claimed creator linkage, and claim safeguards. A creator can claim later; the public profile should read like a creator page, not a repo dashboard.

### Editorial Collections
Support editorial-only collections in MVP. Collections can boost visibility and provide context, but cannot change ownership or creator identity.

### Admin and Moderation
Add editor controls for project status, collection ordering, reindexing, and repository sync retries. Status transitions must be auditable.

## 3. Dependency Map

| Dependency | Needed by | Notes |
| --- | --- | --- |
| GitHub OAuth login | All user actions | Required before submission, save, like, follow, claim |
| Canonical repository model | Import, browse, dedupe, search | Source of truth is `github_repository_id` |
| Project status model | Browse, search, moderation, claim UI | Drives visibility and downranking |
| Creator model | Project cards, detail pages, creator profiles | Separate from submitter identity |
| Score materialization | Browse, search, category pages | Required for status- and score-based ordering |
| Link health checks | Quality score, limited/broken states | GitHub/demo/docs URLs must be validated |
| Editorial collection CRUD | Collections page and detail modules | Editor-owned only in MVP |
| Claim workflow | Creator profiles and project detail | Must include evidence/approval safeguards |

## 4. Sprint-Style Task List

### Sprint 0: Foundations
- Confirm routes, page shells, and navigation labels.
- Finalize the project/creator/collection card contracts.
- Lock the status enum and score gates in code constants.
- Set up GitHub OAuth and user bootstrap.

### Sprint 1: Intake and Data
- Implement `POST /projects/import` and `POST /projects/recommend`.
- Normalize public repo URLs and resolve GitHub repository IDs.
- Create repository and project rows, plus submission provenance.
- Add canonical dedupe and duplicate submission handling.
- Persist sync runs and retry state.

### Sprint 2: Sync and Scoring
- Implement repository metadata sync jobs.
- Add link health checks for GitHub, demo, and docs URLs.
- Materialize `project_scores` with quality, engagement, freshness, editorial, and status gate components.
- Add status transitions for pending, active, limited, featured, archived, and removed.

### Sprint 3: Discovery Surfaces
- Build Explore with featured collections, trending projects, and category chips.
- Build category browse pages and search results with explainable ranking.
- Build project cards with creator-first ordering and one contextual field.
- Build project detail pages with creator context before repo links.

### Sprint 4: Creator and Engagement
- Build creator profile pages with featured projects, collections, and follow state.
- Add save, like, and follow actions.
- Surface saved items as a first-class nav destination.

### Sprint 5: Editorial and Claims
- Add editorial collection CRUD and ordering tools.
- Build creator claim flow with evidence and approval handling.
- Add admin status controls and reindex/sync actions.
- Add duplicate suppression and claim safety checks.

## 5. Recommended Implementation Order

1. Auth and user bootstrap.
2. Canonical repository import and project creation.
3. Score materialization and browse/search ranking.
4. Project detail and Explore surface.
5. Creator profiles and follow/save/like.
6. Editorial collections.
7. Claim flow and admin moderation.

This order front-loads the data contract and ranking engine before UI polish, because discovery quality depends on canonicalization, status gates, and score output being correct.

## 6. Deliverable Checklist

- GitHub login working end to end.
- Public repo import/register supported.
- Canonical dedupe by GitHub ID and URL fallback implemented.
- Project cards, project detail pages, creator profiles, category browse, search, and Saved page shipped.
- Editorial collections editable by staff only.
- Save, like, and builder follow actions working.
- GitHub, demo, and docs links displayed with health awareness.
- One required contextual field rendered on every project.
- Status badges and trust cues visible throughout discovery.
- Ranking downranks stale, thin, broken, duplicate, and removed projects.
- Claim flow exists with safeguards and audit trail.

## 7. Handoff Prompts for Builder Agents

### Backend agent
Implement the repository canonicalization, submission provenance, scoring, and status gating first. Treat `github_repository_id` as the primary dedupe key and preserve submitter identity separately from claimed creator identity.

### Frontend agent
Build creator-forward cards and detail pages. Keep repo links secondary, avoid README excerpts, and make the contextual field visually prominent.

### Search/ranking agent
Rank search and browse by lexical relevance plus `project_scores`, with hard downranking for stale, broken, thin, or duplicate entries. Search must explain why a result surfaced.

### Moderation/admin agent
Expose status transitions, collection ordering, sync retries, and claim approvals. Every status change should be auditable and visible to discovery logic.

### QA agent
Test duplicate repo imports, claim-after-recommend flows, broken-link downgrades, stale repo downgrades, and visibility rules for pending versus active versus featured projects.

