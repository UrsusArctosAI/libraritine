import { d as derived, w as writable } from "./index.js";
const games = writable([]);
const searchQuery = writable("");
const selectedTags = writable([]);
const selectedStatus = writable("all");
const sortBy = writable("title");
const isLoading = writable(false);
const allTags = derived(games, ($games) => {
  const tagSet = /* @__PURE__ */ new Set();
  for (const game of $games) {
    for (const tag of game.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
});
const filteredGames = derived(
  [games, searchQuery, selectedTags, selectedStatus, sortBy],
  ([$games, $query, $tags, $status, $sort]) => {
    let result = [...$games];
    if ($query.trim()) {
      const q = $query.toLowerCase();
      result = result.filter(
        (g) => g.title.toLowerCase().includes(q) || g.raw_folder.toLowerCase().includes(q) || g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if ($tags.length > 0) {
      result = result.filter((g) => $tags.some((t) => g.tags.includes(t)));
    }
    if ($status !== "all") {
      result = result.filter((g) => g.status === $status);
    }
    result.sort((a, b) => {
      switch ($sort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "last_played":
          return (b.last_played || "").localeCompare(a.last_played || "");
        case "date_added":
          return b.date_added.localeCompare(a.date_added);
        case "play_count":
          return b.play_count - a.play_count;
        case "version":
          return compareVersions(a.sort_version, b.sort_version);
        default:
          return 0;
      }
    });
    return result;
  }
);
const stats = derived(games, ($games) => ({
  total: $games.length,
  playing: $games.filter((g) => g.status === "playing").length,
  completed: $games.filter((g) => g.status === "completed").length,
  notStarted: $games.filter((g) => g.status === "not_started").length,
  abandoned: $games.filter((g) => g.status === "abandoned").length
}));
function compareVersions(a, b) {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    const aVal = a[i] || 0;
    const bVal = b[i] || 0;
    if (aVal !== bVal) return aVal - bVal;
  }
  return 0;
}
export {
  allTags as a,
  selectedStatus as b,
  stats as c,
  selectedTags as d,
  searchQuery as e,
  filteredGames as f,
  games as g,
  isLoading as i,
  sortBy as s
};
