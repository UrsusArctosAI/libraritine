import { a as attr_class, b as attr, s as stringify, c as attr_style, e as escape_html, d as ensure_array_like, f as store_get, u as unsubscribe_stores, h as bind_props } from "../../chunks/root.js";
import { s as sortBy, a as allTags, b as selectedStatus, c as stats, d as selectedTags, e as searchQuery, i as isLoading, f as filteredGames, g as games } from "../../chunks/games.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
function TileGrid($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="tile-grid svelte-4qeep8">`);
  children($$renderer);
  $$renderer.push(`<!----></div>`);
}
function GameTile($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { game } = $$props;
    let isHovered = false;
    function getTitleColor(title) {
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = hash % 360;
      return `hsl(${hue}, 40%, 25%)`;
    }
    $$renderer2.push(`<div${attr_class("game-tile svelte-1qer3i", void 0, { "hovered": isHovered })} role="button" tabindex="0"><div class="tile-image svelte-1qer3i">`);
    if (game.thumbnail_path) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", `asset://localhost/${stringify(game.thumbnail_path)}`)}${attr("alt", game.title)} loading="lazy" class="svelte-1qer3i" onerror="this.__e=event"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="placeholder svelte-1qer3i"${attr_style(`background: ${stringify(getTitleColor(game.title))}`)}><span class="placeholder-letter svelte-1qer3i">${escape_html(game.title[0] || "?")}</span></div> `);
    if (game.version) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="version-badge svelte-1qer3i">${escape_html(game.version)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (game.stage) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="stage-badge svelte-1qer3i">${escape_html(game.stage)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="tile-info svelte-1qer3i"><h3 class="tile-title truncate svelte-1qer3i">${escape_html(game.title)}</h3> `);
    if (game.tags.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="tile-tags svelte-1qer3i"><!--[-->`);
      const each_array = ensure_array_like(game.tags.slice(0, 3));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$renderer2.push(`<span class="tag-pill svelte-1qer3i">${escape_html(tag)}</span>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (game.tags.length > 3) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="tag-more svelte-1qer3i">+${escape_html(game.tags.length - 3)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { showSidebar = true } = $$props;
    const statusOptions = [
      { value: "all", label: "All Games", icon: "📚" },
      { value: "not_started", label: "Not Started", icon: "📋" },
      { value: "playing", label: "Playing", icon: "▶️" },
      { value: "completed", label: "Completed", icon: "✅" },
      { value: "abandoned", label: "Abandoned", icon: "🏳️" }
    ];
    const sortOptions = [
      { value: "title", label: "Title" },
      { value: "last_played", label: "Last Played" },
      { value: "date_added", label: "Date Added" },
      { value: "play_count", label: "Play Count" },
      { value: "version", label: "Version" }
    ];
    if (showSidebar) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<aside class="sidebar svelte-129hoe0"><div class="sidebar-header svelte-129hoe0"><h1 class="logo svelte-129hoe0"><span class="logo-icon svelte-129hoe0">📖</span> Libraritine</h1></div> <nav class="sidebar-nav svelte-129hoe0"><div class="nav-section svelte-129hoe0"><h3 class="nav-label svelte-129hoe0">Status</h3> <!--[-->`);
      const each_array = ensure_array_like(statusOptions);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let option = each_array[$$index];
        $$renderer2.push(`<button${attr_class("nav-item svelte-129hoe0", void 0, {
          "active": store_get($$store_subs ??= {}, "$selectedStatus", selectedStatus) === option.value
        })}><span class="nav-icon svelte-129hoe0">${escape_html(option.icon)}</span> <span class="nav-text svelte-129hoe0">${escape_html(option.label)}</span> `);
        if (store_get($$store_subs ??= {}, "$stats", stats)[option.value === "all" ? "total" : option.value] !== void 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="nav-count svelte-129hoe0">${escape_html(store_get($$store_subs ??= {}, "$stats", stats)[option.value === "all" ? "total" : option.value])}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="nav-section svelte-129hoe0"><h3 class="nav-label svelte-129hoe0">Sort By</h3> `);
      $$renderer2.select(
        {
          class: "sort-select",
          value: store_get($$store_subs ??= {}, "$sortBy", sortBy),
          onchange: (e) => sortBy.set(e.target.value)
        },
        ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(sortOptions);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let option = each_array_1[$$index_1];
            $$renderer3.option({ value: option.value }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(option.label)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        },
        "svelte-129hoe0"
      );
      $$renderer2.push(`</div> `);
      if (store_get($$store_subs ??= {}, "$allTags", allTags).length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="nav-section svelte-129hoe0"><h3 class="nav-label svelte-129hoe0">Tags</h3> <div class="tag-list svelte-129hoe0"><!--[-->`);
        const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$allTags", allTags));
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let tag = each_array_2[$$index_2];
          $$renderer2.push(`<button${attr_class("tag-filter svelte-129hoe0", void 0, {
            "active": store_get($$store_subs ??= {}, "$selectedTags", selectedTags).includes(tag)
          })}>${escape_html(tag)}</button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="nav-section nav-bottom svelte-129hoe0"><button class="nav-item svelte-129hoe0"><span class="nav-icon svelte-129hoe0">⚙️</span> <span class="nav-text svelte-129hoe0">Settings</span></button></div></nav></aside>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { showSidebar });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let showSidebar = true;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="home-layout svelte-1uha8ag">`);
      Sidebar($$renderer3, {
        get showSidebar() {
          return showSidebar;
        },
        set showSidebar($$value) {
          showSidebar = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <main class="main-content svelte-1uha8ag"><header class="top-bar svelte-1uha8ag"><button class="sidebar-toggle svelte-1uha8ag">`);
      if (showSidebar) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>`);
      }
      $$renderer3.push(`<!--]--></button> <div class="search-container svelte-1uha8ag"><svg class="search-icon svelte-1uha8ag" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="text" placeholder="Search your library..."${attr("value", store_get($$store_subs ??= {}, "$searchQuery", searchQuery))} class="search-input svelte-1uha8ag"/></div> <div class="top-actions svelte-1uha8ag"><button class="btn btn-secondary svelte-1uha8ag"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"></path><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg> Scan</button> <button class="btn btn-primary svelte-1uha8ag"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg> Add Game</button></div></header> <div class="content-area svelte-1uha8ag">`);
      if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="loading-state svelte-1uha8ag"><div class="spinner svelte-1uha8ag"></div> <p>Loading library...</p></div>`);
      } else if (store_get($$store_subs ??= {}, "$filteredGames", filteredGames).length === 0) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<div class="empty-state svelte-1uha8ag">`);
        if (store_get($$store_subs ??= {}, "$games", games).length === 0) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="empty-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg></div> <h2 class="svelte-1uha8ag">Your library is empty</h2> <p class="svelte-1uha8ag">Scan your Ren'Py games directory or add games manually to get started.</p> <div class="empty-actions svelte-1uha8ag"><button class="btn btn-primary svelte-1uha8ag">Scan Directory</button> <button class="btn btn-secondary svelte-1uha8ag">Add Manually</button></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<p class="svelte-1uha8ag">No games match your current filters.</p>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="library-header svelte-1uha8ag"><span class="game-count svelte-1uha8ag">${escape_html(store_get($$store_subs ??= {}, "$filteredGames", filteredGames).length)} games</span></div> `);
        TileGrid($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$filteredGames", filteredGames));
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let game = each_array[$$index];
              GameTile($$renderer4, { game });
            }
            $$renderer4.push(`<!--]-->`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
      $$renderer3.push(`<!--]--></div></main></div> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
