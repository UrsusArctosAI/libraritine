<script lang="ts">
  import {
    filteredGames,
    searchQuery,
    selectedTags,
    selectedStatus,
    sortBy,
    allTags,
    stats,
    isLoading,
    games,
    loadGames,
    scanGames,
  } from '$lib/stores/games';
  import TileGrid from '$lib/components/TileGrid.svelte';
  import GameTile from '$lib/components/GameTile.svelte';
  import AddGameModal from '$lib/components/AddGameModal.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';

  let showAddModal = $state(false);
  let showSidebar = $state(true);

  async function handleScan() {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Ren\'Py Games Directory',
      });
      if (selected) {
        await scanGames(selected);
      }
    } catch (err) {
      // Fallback: prompt if dialog plugin not available
      console.warn('Dialog plugin not available, using prompt fallback');
      const path = window.prompt('Enter the path to your Ren\'Py games directory:');
      if (path) {
        await scanGames(path);
      }
    }
  }
</script>

<div class="home-layout">
  <Sidebar bind:showSidebar />

  <main class="main-content">
    <header class="top-bar">
      <button class="sidebar-toggle" onclick={() => (showSidebar = !showSidebar)}>
        {#if showSidebar}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        {/if}
      </button>

      <div class="search-container">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search your library..."
          value={$searchQuery}
          oninput={(e) => searchQuery.set((e.target as HTMLInputElement).value)}
          class="search-input"
        />
      </div>

      <div class="top-actions">
        <button class="btn btn-secondary" onclick={handleScan}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          Scan
        </button>
        <button class="btn btn-primary" onclick={() => (showAddModal = true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Game
        </button>
      </div>
    </header>

    <div class="content-area">
      {#if $isLoading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading library...</p>
        </div>
      {:else if $filteredGames.length === 0}
        <div class="empty-state">
          {#if $games.length === 0}
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <h2>Your library is empty</h2>
            <p>Scan your Ren'Py games directory or add games manually to get started.</p>
            <div class="empty-actions">
              <button class="btn btn-primary" onclick={handleScan}>Scan Directory</button>
              <button class="btn btn-secondary" onclick={() => (showAddModal = true)}>Add Manually</button>
            </div>
          {:else}
            <p>No games match your current filters.</p>
          {/if}
        </div>
      {:else}
        <div class="library-header">
          <span class="game-count">{$filteredGames.length} games</span>
        </div>
        <TileGrid>
          {#each $filteredGames as game (game.id)}
            <GameTile {game} />
          {/each}
        </TileGrid>
      {/if}
    </div>
  </main>
</div>

{#if showAddModal}
  <AddGameModal bind:show={showAddModal} />
{/if}

<style>
  .home-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: var(--bg-primary);
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .top-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }

  .sidebar-toggle {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 8px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .sidebar-toggle:hover {
    color: var(--text-primary);
    background: var(--bg-surface);
  }

  .search-container {
    flex: 1;
    max-width: 480px;
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 14px;
    outline: none;
    transition: all var(--transition-fast);
  }

  .search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  .top-actions {
    display: flex;
    gap: 8px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
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

  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .library-header {
    margin-bottom: 16px;
  }

  .game-count {
    color: var(--text-muted);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    text-align: center;
    color: var(--text-secondary);
  }

  .empty-state h2 {
    color: var(--text-primary);
    font-size: 20px;
    font-weight: 600;
  }

  .empty-state p {
    max-width: 400px;
    line-height: 1.6;
  }

  .empty-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    color: var(--text-secondary);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
