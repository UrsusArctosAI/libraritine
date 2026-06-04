import { g as getContext, b as attr, s as stringify, c as attr_style, e as escape_html, d as ensure_array_like, a as attr_class, i as derived, f as store_get, u as unsubscribe_stores } from "../../../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { g as games } from "../../../../chunks/games.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const gameId = derived(() => store_get($$store_subs ??= {}, "$page", page).params.id);
    const game = derived(() => store_get($$store_subs ??= {}, "$games", games).find((g) => g.id === gameId()));
    function getTitleColor(title) {
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = hash % 360;
      return `hsl(${hue}, 40%, 25%)`;
    }
    if (game()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="detail-page svelte-1aeb24j"><header class="detail-header svelte-1aeb24j"><button class="back-btn svelte-1aeb24j"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg> Back to Library</button></header> <div class="detail-content"><div class="detail-banner svelte-1aeb24j">`);
      if (game().thumbnail_path) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<img${attr("src", `asset://localhost/${stringify(game().thumbnail_path)}`)}${attr("alt", game().title)} class="banner-image svelte-1aeb24j"/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="banner-placeholder svelte-1aeb24j"${attr_style(`background: ${stringify(getTitleColor(game().title))}`)}><span class="banner-letter svelte-1aeb24j">${escape_html(game().title[0] || "?")}</span></div> <div class="banner-overlay svelte-1aeb24j"></div></div> <div class="detail-info svelte-1aeb24j"><div class="detail-main svelte-1aeb24j"><div class="title-row svelte-1aeb24j"><h1 class="game-title svelte-1aeb24j">${escape_html(game().title)}</h1> <div class="title-badges svelte-1aeb24j">`);
      if (game().version) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="badge version svelte-1aeb24j">${escape_html(game().version)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (game().platform) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="badge platform svelte-1aeb24j">${escape_html(game().platform)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (game().stage) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="badge stage svelte-1aeb24j">${escape_html(game().stage)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div> <div class="status-selector svelte-1aeb24j"><span class="status-label svelte-1aeb24j">Status:</span> <!--[-->`);
      const each_array = ensure_array_like([
        { value: "not_started", label: "Not Started", icon: "📋" },
        { value: "playing", label: "Playing", icon: "▶️" },
        { value: "completed", label: "Completed", icon: "✅" },
        { value: "abandoned", label: "Abandoned", icon: "🏳️" }
      ]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let option = each_array[$$index];
        $$renderer2.push(`<button${attr_class("status-btn svelte-1aeb24j", void 0, { "active": game().status === option.value })}>${escape_html(option.icon)} ${escape_html(option.label)}</button>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (game().tags.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="tags-section svelte-1aeb24j"><!--[-->`);
        const each_array_1 = ensure_array_like(game().tags);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let tag = each_array_1[$$index_1];
          $$renderer2.push(`<span class="tag-pill svelte-1aeb24j">${escape_html(tag)}</span>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="description-section">`);
        if (game().blurb) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="blurb svelte-1aeb24j">${escape_html(game().blurb)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="blurb empty svelte-1aeb24j">No description yet. Click edit to add one.</p>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (game().features.length > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<ul class="features-list svelte-1aeb24j"><!--[-->`);
          const each_array_2 = ensure_array_like(game().features);
          for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
            let feature = each_array_2[$$index_2];
            $$renderer2.push(`<li class="svelte-1aeb24j">✦ ${escape_html(feature)}</li>`);
          }
          $$renderer2.push(`<!--]--></ul>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--> <div class="action-buttons svelte-1aeb24j"><button class="btn btn-play svelte-1aeb24j"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg> Play</button> <button class="btn btn-secondary svelte-1aeb24j">${escape_html("Edit Metadata")}</button> <button class="btn btn-danger svelte-1aeb24j">Remove from Library</button></div></div> <aside class="detail-sidebar svelte-1aeb24j"><div class="stat-card svelte-1aeb24j"><span class="stat-label svelte-1aeb24j">Play Count</span> <span class="stat-value svelte-1aeb24j">${escape_html(game().play_count)}</span></div> <div class="stat-card svelte-1aeb24j"><span class="stat-label svelte-1aeb24j">Last Played</span> <span class="stat-value svelte-1aeb24j">${escape_html(game().last_played ? new Date(game().last_played).toLocaleDateString() : "Never")}</span></div> <div class="stat-card svelte-1aeb24j"><span class="stat-label svelte-1aeb24j">Date Added</span> <span class="stat-value svelte-1aeb24j">${escape_html(new Date(game().date_added).toLocaleDateString())}</span></div> <div class="stat-card svelte-1aeb24j"><span class="stat-label svelte-1aeb24j">Folder</span> <span class="stat-value mono truncate svelte-1aeb24j">${escape_html(game().raw_folder)}</span></div></aside></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="not-found svelte-1aeb24j"><p>Game not found</p> <button class="btn btn-primary svelte-1aeb24j">Back to Library</button></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
