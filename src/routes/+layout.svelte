<script lang="ts">
  import '../lib/styles/global.css';
  import { onMount } from 'svelte';
  import { loadGames } from '$lib/stores/games';

  let { children } = $props();

  onMount(async () => {
    // Load games on app start
    try {
      await loadGames();
    } catch {
      // App may be in dev mode without Tauri backend
      console.log('Running in dev mode — Tauri backend not available');
    }
  });
</script>

<div class="app-layout">
  {@render children()}
</div>

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }
</style>
