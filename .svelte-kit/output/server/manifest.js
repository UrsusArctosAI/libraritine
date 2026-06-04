export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CR8WDF97.js",app:"_app/immutable/entry/app.Cy3XfPGY.js",imports:["_app/immutable/entry/start.CR8WDF97.js","_app/immutable/chunks/3nGGa0gG.js","_app/immutable/chunks/Cmv9A_gy.js","_app/immutable/entry/app.Cy3XfPGY.js","_app/immutable/chunks/IECi_PHd.js","_app/immutable/chunks/Cmv9A_gy.js","_app/immutable/chunks/CMGP84Yy.js","_app/immutable/chunks/BAw3d3Vc.js","_app/immutable/chunks/nzdqeAfq.js","_app/immutable/chunks/B8EE74do.js","_app/immutable/chunks/MFulnvuH.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/game/[id]",
				pattern: /^\/game\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
