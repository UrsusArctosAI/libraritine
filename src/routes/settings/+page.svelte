<script lang="ts">
  import { goto } from '$app/navigation';

  let gameDir = $state('');
  let theme = $state<'dark' | 'light'>('dark');

  function handleSave() {
    // Save settings to localStorage for now
    localStorage.setItem('libraritine:settings', JSON.stringify({
      gameDir,
      theme,
    }));

    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);

    alert('Settings saved!');
  }

  function handleBack() {
    goto('/');
  }
</script>

<div class="settings-page">
  <header class="settings-header">
    <button class="back-btn" onclick={handleBack}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Back to Library
    </button>
    <h1>Settings</h1>
  </header>

  <div class="settings-content">
    <section class="settings-section">
      <h2>Library</h2>

      <div class="setting-row">
        <div class="setting-info">
          <label for="game-dir">Game Directory</label>
          <p class="setting-desc">The default directory to scan for Ren'Py games.</p>
        </div>
        <input
          id="game-dir"
          type="text"
          placeholder="/path/to/renpy/games"
          bind:value={gameDir}
          class="setting-input"
        />
      </div>
    </section>

    <section class="settings-section">
      <h2>Appearance</h2>

      <div class="setting-row">
        <div class="setting-info">
          <label>Theme</label>
          <p class="setting-desc">Choose between dark and light themes.</p>
        </div>
        <div class="theme-toggle">
          <button
            class="theme-btn"
            class:active={theme === 'dark'}
            onclick={() => { theme = 'dark'; document.documentElement.setAttribute('data-theme', 'dark'); }}
          >
            🌙 Dark
          </button>
          <button
            class="theme-btn"
            class:active={theme === 'light'}
            onclick={() => { theme = 'light'; document.documentElement.setAttribute('data-theme', 'light'); }}
          >
            ☀️ Light
          </button>
        </div>
      </div>
    </section>

    <section class="settings-section">
      <h2>About</h2>
      <div class="about-card">
        <p class="about-name">📖 Libraritine</p>
        <p class="about-version">Version 0.1.0</p>
        <p class="about-desc">
          A library manager and launcher for Ren'Py visual novels.
        </p>
      </div>
    </section>

    <div class="settings-actions">
      <button class="btn btn-primary" onclick={handleSave}>Save Settings</button>
    </div>
  </div>
</div>

<style>
  .settings-page {
    max-width: 640px;
    margin: 0 auto;
    padding: 48px 24px;
    height: 100vh;
    overflow-y: auto;
  }

  .settings-header {
    margin-bottom: 40px;
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
    margin-bottom: 16px;
    transition: all var(--transition-fast);
  }

  .back-btn:hover {
    color: var(--text-primary);
    background: var(--bg-surface);
  }

  .settings-header h1 {
    font-size: 28px;
    font-weight: 700;
  }

  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .settings-section {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 24px;
  }

  .settings-section h2 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--text-primary);
  }

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 12px 0;
  }

  .setting-row + .setting-row {
    border-top: 1px solid var(--border-subtle);
  }

  .setting-info {
    flex: 1;
  }

  .setting-info label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    display: block;
    margin-bottom: 4px;
  }

  .setting-desc {
    font-size: 12px;
    color: var(--text-muted);
  }

  .setting-input {
    width: 300px;
    padding: 8px 12px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 13px;
    font-family: var(--font-mono);
    outline: none;
  }

  .setting-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }

  .theme-toggle {
    display: flex;
    gap: 4px;
    background: var(--bg-surface);
    border-radius: var(--radius-sm);
    padding: 4px;
  }

  .theme-btn {
    padding: 6px 12px;
    background: none;
    border: none;
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 13px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .theme-btn.active {
    background: var(--accent);
    color: white;
  }

  .about-card {
    text-align: center;
    padding: 24px;
  }

  .about-name {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .about-version {
    font-size: 13px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    margin-bottom: 12px;
  }

  .about-desc {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .settings-actions {
    display: flex;
    justify-content: flex-end;
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

  .btn-primary {
    background: var(--accent);
    color: white;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
  }
</style>
