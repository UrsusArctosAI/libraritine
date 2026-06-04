// Game store — manages game state and communicates with Tauri backend
import { writable, derived, get } from 'svelte/store';

export interface Game {
  id: string;
  title: string;
  raw_folder: string;
  folder_path: string;
  version: string | null;
  sort_version: number[] | null;
  stage: string | null;
  platform: string | null;
  blurb: string;
  tags: string[];
  features: string[];
  thumbnail_path: string | null;
  date_added: string;
  last_played: string | null;
  play_count: number;
  status: string;
}

// Core stores
export const games = writable<Game[]>([]);
export const searchQuery = writable('');
export const selectedTags = writable<string[]>([]);
export const selectedStatus = writable<string>('all');
export const sortBy = writable<string>('title');
export const isLoading = writable(false);
export const activeGameId = writable<string | null>(null);

// Derived: all unique tags across all games
export const allTags = derived(games, ($games) => {
  const tagSet = new Set<string>();
  for (const game of $games) {
    for (const tag of game.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
});

// Derived: filtered and sorted games
export const filteredGames = derived(
  [games, searchQuery, selectedTags, selectedStatus, sortBy],
  ([$games, $query, $tags, $status, $sort]) => {
    let result = [...$games];

    // Filter by search query
    if ($query.trim()) {
      const q = $query.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.raw_folder.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by tags
    if ($tags.length > 0) {
      result = result.filter((g) => $tags.some((t) => g.tags.includes(t)));
    }

    // Filter by status
    if ($status !== 'all') {
      result = result.filter((g) => g.status === $status);
    }

    // Sort
    result.sort((a, b) => {
      switch ($sort) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'last_played':
          return (b.last_played || '').localeCompare(a.last_played || '');
        case 'date_added':
          return b.date_added.localeCompare(a.date_added);
        case 'play_count':
          return b.play_count - a.play_count;
        case 'version':
          return compareVersions(a.sort_version, b.sort_version);
        default:
          return 0;
      }
    });

    return result;
  }
);

// Derived: library stats
export const stats = derived(games, ($games) => ({
  total: $games.length,
  playing: $games.filter((g) => g.status === 'playing').length,
  completed: $games.filter((g) => g.status === 'completed').length,
  notStarted: $games.filter((g) => g.status === 'not_started').length,
  abandoned: $games.filter((g) => g.status === 'abandoned').length,
}));

// Actions
export async function loadGames() {
  isLoading.set(true);
  try {
    // Dynamic import for Tauri invoke
    const { invoke } = await import('@tauri-apps/api/core');
    const result = await invoke<Game[]>('get_all_games');
    games.set(result);
  } catch (err) {
    console.error('Failed to load games:', err);
    // Fallback: try to show an error state
    games.set([]);
  } finally {
    isLoading.set(false);
  }
}

export async function scanGames(path: string) {
  isLoading.set(true);
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const result = await invoke<Game[]>('scan_games', { path });
    games.set(result);
  } catch (err) {
    console.error('Failed to scan games:', err);
  } finally {
    isLoading.set(false);
  }
}

export async function launchGame(id: string) {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('launch_game', { id });
    // Refresh play stats
    await loadGames();
  } catch (err) {
    console.error('Failed to launch game:', err);
  }
}

export async function updateGameMetadata(
  id: string,
  metadata: { blurb?: string; tags?: string[]; features?: string[] }
) {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const updated = await invoke<Game>('update_game_metadata', { id, metadata });
    games.update((current) =>
      current.map((g) => (g.id === id ? updated : g))
    );
  } catch (err) {
    console.error('Failed to update metadata:', err);
  }
}

export async function updateGameStatus(id: string, status: string) {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('update_game_status', { id, status });
    games.update((current) =>
      current.map((g) => (g.id === id ? { ...g, status } : g))
    );
  } catch (err) {
    console.error('Failed to update status:', err);
  }
}

export async function deleteGame(id: string) {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('delete_game', { id });
    games.update((current) => current.filter((g) => g.id !== id));
  } catch (err) {
    console.error('Failed to delete game:', err);
  }
}

export async function addGameManual(folderPath: string) {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const game = await invoke<Game>('add_game_manual', { folderPath });
    games.update((current) => [...current, game]);
    return game;
  } catch (err) {
    console.error('Failed to add game:', err);
    throw err;
  }
}

// Helper: compare version arrays numerically
function compareVersions(a: number[] | null, b: number[] | null): number {
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
