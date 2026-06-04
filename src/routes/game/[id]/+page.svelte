<script lang="ts">
  import { page } from '$app/stores';
  import { games, launchGame, updateGameMetadata, updateGameStatus, deleteGame } from '$lib/stores/games';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  const gameId = $derived($page.params.id);
  const game = $derived($games.find((g) => g.id === gameId));

  let editing = $state(false);
  let editBlurb = $state('');
  let editTags = $state('');
  let editFeatures = $state('');

  $effect(() => {
    if (game) {
      editBlurb = game.blurb;
      editTags = game.tags.join(', ');
      editFeatures = game.features.join('\n');
    }
  });

  async function handleSaveMetadata() {
    if (!game) return;
    await updateGameMetadata(game.id, {
      blurb: editBlurb,
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      features: editFeatures
        .split('\n')
        .map((f) => f.replace(/^[✦•-]\s*/, '').trim())
        .filter(Boolean),
    });
    editing = false;
  }

  async function handleDelete() {
    if (!game) return;
    if (confirm(`Remove "${game.title}" from your library?`)) {
      await deleteGame(game.id);
      goto('/');
    }
  }

  function getTitleColor(title: string): string {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 40%, 25%)`;
  }
</script>

{#if game}
  <div class="detail-page">
    <header class="detail-header">
      <button class="back-btn" onclick={() => goto('/')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Library
      </button>
    </header>

    <div class="detail-content">
      <div class="detail-banner">
        {#if game.thumbnail_path}
          <img
            src="asset://localhost/{game.thumbnail_path}"
            alt={game.title}
            class="banner-image"
          />
        {/if}
        <div class="banner-placeholder" style="background: {getTitleColor(game.title)}">
          <span class="banner-letter">{game.title[0] || '?'}</span>
        </div>
        <div class="banner-overlay"></div>
      </div>

      <div class="detail-info">
        <div class="detail-main">
          <div class="title-row">
            <h1 class="game-title">{game.title}</h1>
            <div class="title-badges">
              {#if game.version}
                <span class="badge version">{game.version}</span>
              {/if}
              {#if game.platform}
                <span class="badge platform">{game.platform}</span>
              {/if}
              {#if game.stage}
                <span class="badge stage">{game.stage}</span>
              {/if}
            </div>
          </div>

          <!-- Status selector -->
          <div class="status-selector">
            <span class="status-label">Status:</span>
            {#each [
              { value: 'not_started', label: 'Not Started', icon: '📋' },
              { value: 'playing', label: 'Playing', icon: '▶️' },
              { value: 'completed', label: 'Completed', icon: '✅' },
              { value: 'abandoned', label: 'Abandoned', icon: '🏳️' },
            ] as option}
              <button
                class="status-btn"
                class:active={game.status === option.value}
                onclick={() => updateGameStatus(game.id, option.value)}
              >
                {option.icon} {option.label}
              </button>
            {/each}
          </div>

          <!-- Tags -->
          {#if game.tags.length > 0}
            <div class="tags-section">
              {#each game.tags as tag}
                <span class="tag-pill">{tag}</span>
              {/each}
            </div>
          {/if}

          <!-- Blurb -->
          {#if editing}
            <div class="edit-section">
              <label for="edit-blurb">Description</label>
              <textarea id="edit-blurb" bind:value={editBlurb} rows="3"></textarea>

              <label for="edit-tags">Tags (comma-separated)</label>
              <input id="edit-tags" type="text" bind:value={editTags} />

              <label for="edit-features">Features (one per line)</label>
              <textarea id="edit-features" bind:value={editFeatures} rows="4"></textarea>

              <div class="edit-actions">
                <button class="btn btn-secondary" onclick={() => (editing = false)}>Cancel</button>
                <button class="btn btn-primary" onclick={handleSaveMetadata}>Save</button>
              </div>
            </div>
          {:else}
            <div class="description-section">
              {#if game.blurb}
                <p class="blurb">{game.blurb}</p>
              {:else}
                <p class="blurb empty">No description yet. Click edit to add one.</p>
              {/if}

              {#if game.features.length > 0}
                <ul class="features-list">
                  {#each game.features as feature}
                    <li>✦ {feature}</li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}

          <!-- Actions -->
          <div class="action-buttons">
            <button class="btn btn-play" onclick={() => launchGame(game.id)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>
            <button class="btn btn-secondary" onclick={() => (editing = !editing)}>
              {editing ? 'Cancel Edit' : 'Edit Metadata'}
            </button>
            <button class="btn btn-danger" onclick={handleDelete}>
              Remove from Library
            </button>
          </div>
        </div>

        <!-- Sidebar stats -->
        <aside class="detail-sidebar">
          <div class="stat-card">
            <span class="stat-label">Play Count</span>
            <span class="stat-value">{game.play_count}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Last Played</span>
            <span class="stat-value">
              {game.last_played
                ? new Date(game.last_played).toLocaleDateString()
                : 'Never'}
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Date Added</span>
            <span class="stat-value">
              {new Date(game.date_added).toLocaleDateString()}
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Folder</span>
            <span class="stat-value mono truncate">{game.raw_folder}</span>
          </div>
        </aside>
      </div>
    </div>
  </div>
{:else}
  <div class="not-found">
    <p>Game not found</p>
    <button class="btn btn-primary" onclick={() => goto('/')}>Back to Library</button>
  </div>
{/if}

<style>
  .detail-page {
    height: 100vh;
    overflow-y: auto;
    background: var(--bg-primary);
  }

  .detail-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(20, 20, 20, 0.9);
    backdrop-filter: blur(8px);
    padding: 12px 24px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .back-btn:hover {
    color: var(--text-primary);
    background: var(--bg-surface);
  }

  .detail-banner {
    position: relative;
    height: 320px;
    overflow: hidden;
  }

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-letter {
    font-size: 120px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.1);
  }

  .banner-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, var(--bg-primary), transparent);
  }

  .detail-info {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 32px;
    padding: 0 48px 48px;
    margin-top: -48px;
    position: relative;
  }

  .detail-main {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .title-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }

  .game-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .title-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding-top: 6px;
  }

  .badge {
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 600;
  }

  .badge.version {
    background: var(--bg-surface);
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .badge.platform {
    background: var(--accent-subtle);
    color: var(--text-accent);
    text-transform: uppercase;
  }

  .badge.stage {
    background: rgba(251, 191, 36, 0.15);
    color: var(--warning);
    text-transform: uppercase;
  }

  .status-selector {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-btn {
    padding: 4px 10px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .status-btn:hover {
    border-color: var(--border);
    color: var(--text-primary);
  }

  .status-btn.active {
    background: var(--accent-subtle);
    border-color: var(--accent);
    color: var(--text-accent);
  }

  .tags-section {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tag-pill {
    padding: 4px 10px;
    background: var(--accent-subtle);
    color: var(--text-accent);
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .blurb {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  .blurb.empty {
    font-style: italic;
    color: var(--text-muted);
  }

  .features-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 12px;
  }

  .features-list li {
    font-size: 14px;
    color: var(--text-accent);
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .btn-play {
    background: var(--accent);
    color: white;
    font-size: 16px;
    padding: 12px 32px;
  }

  .btn-play:hover {
    background: var(--accent-hover);
    transform: scale(1.02);
  }

  .btn-primary {
    background: var(--accent);
    color: white;
  }

  .btn-secondary {
    background: var(--bg-surface);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    color: var(--text-primary);
    background: var(--bg-card-hover);
  }

  .btn-danger {
    background: rgba(248, 113, 113, 0.1);
    color: var(--error);
    border: 1px solid rgba(248, 113, 113, 0.2);
  }

  .btn-danger:hover {
    background: rgba(248, 113, 113, 0.2);
  }

  .detail-sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
  }

  .stat-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .stat-value.mono {
    font-family: var(--font-mono);
    font-size: 11px;
    word-break: break-all;
  }

  .edit-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .edit-section label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .edit-section input,
  .edit-section textarea {
    padding: 10px 14px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 14px;
    font-family: var(--font-sans);
    resize: vertical;
    outline: none;
  }

  .edit-section input:focus,
  .edit-section textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }

  .edit-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 16px;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .detail-info {
      grid-template-columns: 1fr;
      padding: 0 24px 24px;
    }

    .detail-banner {
      height: 200px;
    }

    .game-title {
      font-size: 24px;
    }
  }
</style>
