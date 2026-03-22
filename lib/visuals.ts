const projectCoverClasses: Record<string, string> = {
  "agent-handbook":
    "bg-[radial-gradient(circle_at_top_right,rgba(111,255,138,0.25),transparent_32%),linear-gradient(135deg,#12151f,#1e2331)] text-white",
  briefsync:
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%),linear-gradient(135deg,#8d1531,#d73a45)] text-white",
  "starter-lab":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,248,164,0.28),transparent_34%),linear-gradient(135deg,#15396c,#2a67c9)] text-white",
  "signal-watch":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#5a368e,#9a6be4)] text-white"
};

const creatorCoverClasses: Record<string, string> = {
  "mina-cho":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#ffbd8d,#ff8f6b)]",
  "jay-park":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#6ea8ff,#3767d2)]",
  "unclaimed-builder":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#8ce7ce,#33b18a)]"
};

const collectionCoverClasses: Record<string, string> = {
  "starter-projects-worth-forking":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#0b1a34,#253c6e)] text-white",
  "tools-with-a-point-of-view":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#7e1229,#c92848)] text-white",
  "founder-automation-stack":
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#71570a,#c0911e)] text-white"
};

const defaultProjectCover =
  "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#444b61,#6a7696)] text-white";
const defaultCreatorCover =
  "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#d6ddff,#eff2ff)]";
const defaultCollectionCover =
  "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#5c63ea,#8c92ff)] text-white";

export function getProjectCoverClass(slug: string) {
  return projectCoverClasses[slug] ?? defaultProjectCover;
}

export function getCreatorCoverClass(slug: string) {
  return creatorCoverClasses[slug] ?? defaultCreatorCover;
}

export function getCollectionCoverClass(slug: string) {
  return collectionCoverClasses[slug] ?? defaultCollectionCover;
}
