<script lang="ts">
  import type { Game } from '$lib/stores/games';
  import { launchGame } from '$lib/stores/games';
  import HoverCard from './HoverCard.svelte';
  import { goto } from '$app/navigation';

  let { game }: { game: Game } = $props();
  let isHovered = $state(false);
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

  function handleMouseEnter() {
    hoverTimeout = setTimeout(() => {
      isHovered = true;
    }, 300);
  }

  function handleMouseLeave() {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    isHovered = false;
  }

  function handleClick() {
    goto(`/game/${game.id}`);
  }

  function handlePlay(e: Event) {
    e.stopPropagation();
    launchGame(game.id);
  }

  // Generate a deterministic color from the title for placeholder tiles
  function getTitleColor(title: string): string {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 40%, 25%)`;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="game-tile"
  class:hovered={isHovered}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={handleClick}
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.key === 'Enter') handleClick();
  }}
>
  <div class="tile-image">
    {#if game.thumbnail_path}
      <img
        src="asset://localhost/{game.thumbnail_path}"
        alt={game.title}
        loading="lazy"
        onerror={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    {/if}
    <div class="placeholder" style="background: {getTitleColor(game.title)}">
      <span class="placeholder-letter">{game.title[0] || '?'}</span>
    </div>

    <!-- Version badge -->
    {#if game.version}
      <div class="version-badge">{game.version}</div>
    {/if}

    <!-- Stage badge -->
    {#if game.stage}
      <div class="stage-badge">{game.stage}</div>
    {/if}
  </div>

  <div class="tile-info">
    <h3 class="tile-title truncate">{game.title}</h3>
    {#if game.tags.length > 0}
      <div class="tile-tags">
        {#each game.tags.slice(0, 3) as tag}
          <span class="tag-pill">{tag}</span>
        {/each}
        {#if game.tags.length > 3}
          <span class="tag-more">+{game.tags.length - 3}</span>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Hover card overlay -->
  {#if isHovered}
    <HoverCard {game} onPlay={handlePlay} />
  {/if}
</div>

<style>
  .game-tile {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-normal);
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
  }

  .game-tile:hover,
  .game-tile.hovered {
    transform: scale(1.03);
    z-index: 10;
    box-shadow: var(--shadow-hover);
  }

  .tile-image {
    position: relative;
    aspect-ratio: var(--tile-aspect);
    overflow: hidden;
    background: var(--bg-surface);
  }

  .tile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  .placeholder-letter {
    font-size: 48px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.2);
    text-transform: uppercase;
    user-select: none;
  }

  .version-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    color: var(--text-primary);
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
  }

  .stage-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: var(--warning);
    color: #1a1a2e;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tile-info {
    padding: 12px;
  }

  .tile-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 6px;
    line-height: 1.3;
  }

  .tile-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .tag-pill {
    font-size: 10px;
    padding: 2px 6px;
    background: var(--accent-subtle);
    color: var(--text-accent);
    border-radius: 4px;
    font-weight: 500;
  }

  .tag-more {
    font-size: 10px;
    padding: 2px 6px;
    color: var(--text-muted);
  }
</style>
