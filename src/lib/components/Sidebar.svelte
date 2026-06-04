<script lang="ts">
  import {
    selectedTags,
    selectedStatus,
    sortBy,
    allTags,
    stats,
    games,
  } from '$lib/stores/games';
  import { goto } from '$app/navigation';

  let { showSidebar = $bindable(true) }: { showSidebar: boolean } = $props();

  const statusOptions = [
    { value: 'all', label: 'All Games', icon: '📚' },
    { value: 'not_started', label: 'Not Started', icon: '📋' },
    { value: 'playing', label: 'Playing', icon: '▶️' },
    { value: 'completed', label: 'Completed', icon: '✅' },
    { value: 'abandoned', label: 'Abandoned', icon: '🏳️' },
  ];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'last_played', label: 'Last Played' },
    { value: 'date_added', label: 'Date Added' },
    { value: 'play_count', label: 'Play Count' },
    { value: 'version', label: 'Version' },
  ];

  function toggleTag(tag: string) {
    selectedTags.update((current) => {
      if (current.includes(tag)) {
        return current.filter((t) => t !== tag);
      }
      return [...current, tag];
    });
  }
</script>

{#if showSidebar}
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo">
        <span class="logo-icon">📖</span>
        Libraritine
      </h1>
    </div>

    <nav class="sidebar-nav">
      <!-- Status filters -->
      <div class="nav-section">
        <h3 class="nav-label">Status</h3>
        {#each statusOptions as option}
          <button
            class="nav-item"
            class:active={$selectedStatus === option.value}
            onclick={() => selectedStatus.set(option.value)}
          >
            <span class="nav-icon">{option.icon}</span>
            <span class="nav-text">{option.label}</span>
            {#if $stats[option.value === 'all' ? 'total' : option.value] !== undefined}
              <span class="nav-count">
                {$stats[option.value === 'all' ? 'total' : option.value]}
              </span>
            {/if}
          </button>
        {/each}
      </div>

      <!-- Sort -->
      <div class="nav-section">
        <h3 class="nav-label">Sort By</h3>
        <select
          class="sort-select"
          value={$sortBy}
          onchange={(e) => sortBy.set((e.target as HTMLSelectElement).value)}
        >
          {#each sortOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>

      <!-- Tags -->
      {#if $allTags.length > 0}
        <div class="nav-section">
          <h3 class="nav-label">Tags</h3>
          <div class="tag-list">
            {#each $allTags as tag}
              <button
                class="tag-filter"
                class:active={$selectedTags.includes(tag)}
                onclick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Settings link -->
      <div class="nav-section nav-bottom">
        <button class="nav-item" onclick={() => goto('/settings')}>
          <span class="nav-icon">⚙️</span>
          <span class="nav-text">Settings</span>
        </button>
      </div>
    </nav>
  </aside>
{/if}

<style>
  .sidebar {
    width: 240px;
    min-width: 240px;
    height: 100vh;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      width: 0;
      min-width: 0;
      opacity: 0;
    }
    to {
      width: 240px;
      min-width: 240px;
      opacity: 1;
    }
  }

  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .logo {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-icon {
    font-size: 24px;
  }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }

  .nav-section {
    margin-bottom: 24px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    padding: 0 8px;
    margin-bottom: 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 12px;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 13px;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
  }

  .nav-item:hover {
    background: var(--bg-surface);
    color: var(--text-primary);
  }

  .nav-item.active {
    background: var(--accent-subtle);
    color: var(--text-accent);
  }

  .nav-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  .nav-text {
    flex: 1;
  }

  .nav-count {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    min-width: 20px;
    text-align: right;
  }

  .sort-select {
    width: 100%;
    padding: 8px 12px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 13px;
    cursor: pointer;
    outline: none;
  }

  .sort-select:focus {
    border-color: var(--accent);
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .tag-filter {
    padding: 4px 8px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 11px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .tag-filter:hover {
    border-color: var(--border);
    color: var(--text-primary);
  }

  .tag-filter.active {
    background: var(--accent-subtle);
    border-color: var(--accent);
    color: var(--text-accent);
  }

  .nav-bottom {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }
</style>
