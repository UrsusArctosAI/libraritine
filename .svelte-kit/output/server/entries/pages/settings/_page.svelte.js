import { b as attr, a as attr_class } from "../../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let gameDir = "";
    let theme = "dark";
    $$renderer2.push(`<div class="settings-page svelte-1i19ct2"><header class="settings-header svelte-1i19ct2"><button class="back-btn svelte-1i19ct2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg> Back to Library</button> <h1 class="svelte-1i19ct2">Settings</h1></header> <div class="settings-content svelte-1i19ct2"><section class="settings-section svelte-1i19ct2"><h2 class="svelte-1i19ct2">Library</h2> <div class="setting-row svelte-1i19ct2"><div class="setting-info svelte-1i19ct2"><label for="game-dir" class="svelte-1i19ct2">Game Directory</label> <p class="setting-desc svelte-1i19ct2">The default directory to scan for Ren'Py games.</p></div> <input id="game-dir" type="text" placeholder="/path/to/renpy/games"${attr("value", gameDir)} class="setting-input svelte-1i19ct2"/></div></section> <section class="settings-section svelte-1i19ct2"><h2 class="svelte-1i19ct2">Appearance</h2> <div class="setting-row svelte-1i19ct2"><div class="setting-info svelte-1i19ct2"><label class="svelte-1i19ct2">Theme</label> <p class="setting-desc svelte-1i19ct2">Choose between dark and light themes.</p></div> <div class="theme-toggle svelte-1i19ct2"><button${attr_class("theme-btn svelte-1i19ct2", void 0, { "active": theme === "dark" })}>🌙 Dark</button> <button${attr_class("theme-btn svelte-1i19ct2", void 0, { "active": theme === "light" })}>☀️ Light</button></div></div></section> <section class="settings-section svelte-1i19ct2"><h2 class="svelte-1i19ct2">About</h2> <div class="about-card svelte-1i19ct2"><p class="about-name svelte-1i19ct2">📖 Libraritine</p> <p class="about-version svelte-1i19ct2">Version 0.1.0</p> <p class="about-desc svelte-1i19ct2">A library manager and launcher for Ren'Py visual novels.</p></div></section> <div class="settings-actions svelte-1i19ct2"><button class="btn btn-primary svelte-1i19ct2">Save Settings</button></div></div></div>`);
  });
}
export {
  _page as default
};
