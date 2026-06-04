<script lang="ts">
  import type { Game } from '$lib/stores/games';

  let { game, onPlay }: { game: Game; onPlay: (e: Event) => void } = $props();
</script>

<div class="hover-card" onclick={(e) => e.stopPropagation()}>
  <div class="hover-card-content">
    {#if game.blurb}
      <p class="blurb">{game.blurb}</p>
    {:else}
      <p class="blurb placeholder-text">No description yet</p>
    {/if}

    {#if game.features.length > 0}
      <ul class="features">
        {#each game.features as feature}
          <li>✦ {feature}</li>
        {/each}
      </ul>
    {/if}

    <div class="hover-meta">
      {#if game.platform}
        <span class="meta-item">🖥️ {game.platform}</span>
      {/if}
      {#if game.play_count > 0}
        <span class="meta-item">▶ {game.play_count} play{game.play_count !== 1 ? 's' : ''}</span>
      {/if}
    </div>

    <button class="play-btn" onclick={onPlay}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
      Play
    </button>
  </div>
</div>

<style>
  .hover-card {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(20, 20, 20, 0.98) 60%, transparent 100%);
    padding: 48px 12px 12px;
    animation: fadeSlideUp 0.2s ease-out;
    pointer-events: auto;
  }

  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hover-card-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .blurb {
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-secondary);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .placeholder-text {
    font-style: italic;
    color: var(--text-muted);
  }

  .features {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
  }

  .features li {
    font-size: 11px;
    color: var(--text-accent);
    white-space: nowrap;
  }

  .hover-meta {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .meta-item {
    white-space: nowrap;
  }

  .play-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 8px 16px;
    margin-top: 4px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .play-btn:hover {
    background: var(--accent-hover);
    transform: scale(1.02);
  }
</style>
