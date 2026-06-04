

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.B6ZeEbkJ.js","_app/immutable/chunks/nzdqeAfq.js","_app/immutable/chunks/Cmv9A_gy.js","_app/immutable/chunks/D2kygyqQ.js","_app/immutable/chunks/IECi_PHd.js","_app/immutable/chunks/9tWDAcaF.js"];
export const stylesheets = ["_app/immutable/assets/0.Cvbre6dq.css"];
export const fonts = [];
