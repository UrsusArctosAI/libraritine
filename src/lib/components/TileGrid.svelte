<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="tile-grid">
  {@render children()}
</div>

<style>
  .tile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--tile-width), 1fr));
    gap: var(--tile-gap);
    padding-bottom: 48px;
  }

  @media (max-width: 1200px) {
    .tile-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
  }

  @media (max-width: 768px) {
    .tile-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }
  }
</style>
