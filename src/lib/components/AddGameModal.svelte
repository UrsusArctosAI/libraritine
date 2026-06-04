<script lang="ts">
  import { addGameManual } from '$lib/stores/games';

  let { show = $bindable(false) }: { show: boolean } = $props();
  let folderPath = $state('');
  let error = $state('');
  let isAdding = $state(false);

  async function handleAdd() {
    if (!folderPath.trim()) {
      error = 'Please enter a path';
      return;
    }

    isAdding = true;
    error = '';

    try {
      await addGameManual(folderPath.trim());
      show = false;
      folderPath = '';
    } catch (e) {
      error = String(e);
    } finally {
      isAdding = false;
    }
  }

  function handleCancel() {
    show = false;
    folderPath = '';
    error = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') handleCancel();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-overlay" onclick={handleCancel}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2>Add Game</h2>
        <button class="close-btn" onclick={handleCancel}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <p class="description">
          Enter the full path to a Ren'Py game folder.
        </p>

        <div class="input-group">
          <label for="folder-path">Game Folder Path</label>
          <input
            id="folder-path"
            type="text"
            placeholder="/path/to/GameName-v1.0-pc"
            bind:value={folderPath}
            onkeydown={(e) => {
              if (e.key === 'Enter') handleAdd();
            }}
          />
        </div>

        {#if error}
          <div class="error-message">{error}</div>
        {/if}
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" onclick={handleCancel}>Cancel</button>
        <button
          class="btn btn-primary"
          onclick={handleAdd}
          disabled={isAdding || !folderPath.trim()}
        >
          {#if isAdding}
            Adding...
          {:else}
            Add Game
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.15s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    width: 480px;
    max-width: 90vw;
    box-shadow: var(--shadow-hover);
    animation: scaleIn 0.2s ease-out;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .modal-header h2 {
    font-size: 18px;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    color: var(--text-primary);
    background: var(--bg-surface);
  }

  .modal-body {
    padding: 24px;
  }

  .description {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 20px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-group label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-group input {
    padding: 10px 14px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 14px;
    font-family: var(--font-mono);
    outline: none;
    transition: all var(--transition-fast);
  }

  .input-group input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }

  .input-group input::placeholder {
    color: var(--text-muted);
    font-family: var(--font-mono);
  }

  .error-message {
    margin-top: 12px;
    padding: 8px 12px;
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.2);
    border-radius: var(--radius-sm);
    color: var(--error);
    font-size: 13px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 24px;
    border-top: 1px solid var(--border-subtle);
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
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
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
</style>
