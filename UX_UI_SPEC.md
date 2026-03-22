# UX/UI Spec: Creator Curation Platform

## 1. UX Principles

- Creator-first, not repo-first: every project surface starts with creator context, then repo metadata.
- Curate, do not dump: imported GitHub data is raw input, not the final presentation layer.
- Signal over exhaustiveness: show one high-value contextual field on every project, not a long metadata pile.
- Quality is visible: new submissions, claims, and recommendations must carry status and trust cues.
- Discovery is the main job: navigation and layouts should prioritize browsing, search, and saving.
- Reuse is the value: collections and creator profiles should explain why something matters and where it fits.
- MVP stays lightweight: no workflow/build log surfaces, no repo management UI, no enterprise dashboards.

## 2. Home Wireframe

Primary nav: `Explore`, `Creators`, `Collections`, `Saved`

```text
+-------------------------------------------------------------+
| Logo   Search projects, creators, collections...  [GitHub] |
+-------------------------------------------------------------+
| Explore | Creators | Collections | Saved                    |
+-------------------------------------------------------------+
| Hero: "Discover projects worth reusing"                     |
| Subcopy: curated dev projects, creator context, signals     |
| [Browse trending] [Browse by category] [Submit a repo]      |
+-------------------------------------------------------------+
| Featured collections                                         |
| [Card] [Card] [Card]                                         |
+-------------------------------------------------------------+
| Trending projects                                            |
| [Project card] [Project card] [Project card]                |
+-------------------------------------------------------------+
| Category browse chips                                        |
| AI  Frontend  CLI  Infra  Data  Design Systems  Games       |
+-------------------------------------------------------------+
```

Behavior:
- Home defaults to curated discovery, not a feed of everything.
- Search is always available and can search projects, creators, and collections.
- A single CTA for submission is present but visually secondary to browsing.

## 3. Project Card Spec

Card order:
1. Creator avatar + creator name
2. Project title
3. One-line contextual field
4. Category chips
5. Trust/status row
6. Actions

Required fields:
- Creator name and avatar.
- Project title.
- High-signal contextual field. Choose one: `Why it matters`, `Best for`, or `What it solves`.
- Category or tags, limited to 2-3.
- Status badge: `Claimed`, `Unclaimed`, or `Recommended`.
- Save/like affordance.

Optional fields:
- GitHub stars, if relevant, but not visually dominant.
- Demo icon, docs icon, GitHub icon.
- Dedupe/suppression warning if a similar repo already exists.

Visual rules:
- Keep card height consistent.
- Make the creator line visually stronger than the repo source.
- Do not show README excerpts.
- Do not show more than 2 lines of description.

## 4. Creator Profile Spec

Profile header:
- Avatar, creator name, short creator bio.
- Primary links: GitHub, website, X/LinkedIn only if available.
- Follow button.
- Stats: projects, collections, followers, saved by others.

Profile sections:
- `Featured Projects` first.
- `Collections` second.
- `About` third, with concise creator context.
- `Activity` only if it can be expressed as curation, claims, or new additions.

Layout behavior:
- The profile should read like a creator page, not a repository dashboard.
- Project grid should retain the same card language as Explore.
- Empty states should encourage claiming unclaimed projects or creating editorial collections.

## 5. Project Detail Spec

Above the fold:
- Creator header/context before repo links.
- Project title.
- One-sentence contextual hook.
- Status badge and trust cue.
- Primary actions: Save, Like, Follow creator.
- Secondary links: GitHub, Demo, Docs.

Detail order:
1. Creator context and claim status
2. Project summary card
3. Core metadata
4. Category and related projects
5. Collections featuring this project
6. Submission or claim CTA if unclaimed

Required content:
- Creator name and avatar.
- Claim state visible.
- One high-signal contextual field.
- Basic metadata only: language, category, repo source, last updated if useful.
- Related collections and creator links.

Anti-patterns to avoid:
- Repo-link toolbar at the top.
- README wall of text.
- Treating GitHub as the primary object.
- Hiding unclaimed status behind a generic import state.

## 6. Discovery UI Pattern

Pattern name: `Curated Surface + Faceted Explore`

Structure:
- Top search bar with typeahead across projects, creators, collections.
- Left or top facets depending on viewport.
- Curated sections for `Trending`, `New`, `Most Saved`, `Editor Picks`.
- Category chips for quick narrowing.
- Result cards remain creator-forward and status-aware.

Rules:
- Search results should always show why something surfaced.
- Recommendations should be explainable through tags, collections, or creator relevance.
- Show suppression only as a quiet state, never as a dead-end.
- Open submission should surface quality checks: duplicate detection, claim state, and public visibility.

Mobile pattern:
- Search first.
- Chips scroll horizontally.
- Results stack as full-width cards with creator context visible.

## 7. Visual Direction Notes

Direction: `Editorial Tech`

Tone:
- Feels like a high-signal magazine for developers, not enterprise admin software.
- Use strong typography, generous spacing, and selective emphasis.
- Avoid sterile tables, dense filters, and default dashboard chrome.

Color:
- Base on a deep neutral background or warm off-white canvas.
- Use one vivid accent for primary actions and one restrained success signal for status.
- Status colors should be subtle, not loud badges everywhere.

Typography:
- Use a distinctive display face for section headers and a highly legible sans for UI text.
- Headings should feel editorial; body text should stay compact and precise.

Components:
- Cards should feel tactile, with soft elevation or outlined layers, not flat list items.
- Chips and badges should be compact and functional.
- Use iconography sparingly for GitHub, Demo, Docs, and save states.

Motion:
- Small entrance stagger on home sections.
- Gentle hover lift on cards.
- No heavy animation that slows browsing.

Overall composition:
- Large hero with sharp editorial framing.
- Curated modules separated by rhythm, not grid sameness.
- Project detail should feel like a story about the creator and the project's usefulness.
