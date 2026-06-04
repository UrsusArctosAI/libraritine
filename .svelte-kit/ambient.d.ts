
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const HERMES_HOME: string;
	export const HERMES_GATEWAY_SESSION: string;
	export const HERMES_DASHBOARD_TUI: string;
	export const AGENT_BROWSER_EXECUTABLE_PATH: string;
	export const TERMINAL_PERSISTENT_SHELL: string;
	export const TERMINAL_DOCKER_ENV: string;
	export const TERMINAL_CONTAINER_CPU: string;
	export const TELEGRAM_ALLOWED_CHATS: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const BROWSER_INACTIVITY_TIMEOUT: string;
	export const SHELL: string;
	export const DISCORD_HISTORY_BACKFILL: string;
	export const TMPDIR: string;
	export const TERMINAL_LIFETIME_SECONDS: string;
	export const HOMEBREW_REPOSITORY: string;
	export const PYTHONUNBUFFERED: string;
	export const TERMINAL_DOCKER_VOLUMES: string;
	export const HERMES_QUIET: string;
	export const VISION_TOOLS_DEBUG: string;
	export const TERMINAL_ENV: string;
	export const TAURI_CLI_VERBOSITY: string;
	export const MallocNanoZone: string;
	export const HERMES_DASHBOARD_SESSION_TOKEN: string;
	export const DISCORD_ALLOWED_CHANNELS: string;
	export const TAURI_ENV_DEBUG: string;
	export const MOA_TOOLS_DEBUG: string;
	export const TERMINAL_CONTAINER_PERSISTENT: string;
	export const USER: string;
	export const WEB_TOOLS_DEBUG: string;
	export const TAURI_ENV_TARGET_TRIPLE: string;
	export const COMMAND_MODE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const MATRIX_ALLOWED_ROOMS: string;
	export const IMAGE_TOOLS_DEBUG: string;
	export const npm_execpath: string;
	export const TAURI_ENV_PLATFORM: string;
	export const TERMINAL_SINGULARITY_IMAGE: string;
	export const SLACK_REQUIRE_MENTION: string;
	export const SLACK_ALLOWED_CHANNELS: string;
	export const PATH: string;
	export const npm_package_json: string;
	export const __CFBundleIdentifier: string;
	export const TAURI_ENV_PLATFORM_VERSION: string;
	export const TAURI_ENV_FAMILY: string;
	export const HERMES_REDACT_SECRETS: string;
	export const BROWSERBASE_ADVANCED_STEALTH: string;
	export const TERMINAL_DAYTONA_IMAGE: string;
	export const PWD: string;
	export const npm_command: string;
	export const npm_lifecycle_event: string;
	export const TERMINAL_DOCKER_MOUNT_CWD_TO_WORKSPACE: string;
	export const npm_package_name: string;
	export const NODE_PATH: string;
	export const DISCORD_HISTORY_BACKFILL_LIMIT: string;
	export const XPC_FLAGS: string;
	export const HERMES_INTERACTIVE: string;
	export const TERMINAL_TIMEOUT: string;
	export const TERMINAL_MODAL_IMAGE: string;
	export const TAURI_ENV_ARCH: string;
	export const TERMINAL_DOCKER_IMAGE: string;
	export const TERMINAL_CONTAINER_MEMORY: string;
	export const npm_config_node_gyp: string;
	export const pnpm_config_verify_deps_before_run: string;
	export const XPC_SERVICE_NAME: string;
	export const TERMINAL_CWD: string;
	export const npm_package_version: string;
	export const TELEGRAM_REACTIONS: string;
	export const SHLVL: string;
	export const HOME: string;
	export const HOMEBREW_PREFIX: string;
	export const DISCORD_REACTIONS: string;
	export const PYTHONPATH: string;
	export const LOGNAME: string;
	export const SLACK_FREE_RESPONSE_CHANNELS: string;
	export const HERMES_WEB_DIST: string;
	export const npm_lifecycle_script: string;
	export const LC_CTYPE: string;
	export const BROWSERBASE_PROXIES: string;
	export const DISCORD_THREAD_REQUIRE_MENTION: string;
	export const npm_config_user_agent: string;
	export const TERMINAL_DOCKER_RUN_AS_HOST_USER: string;
	export const TERMINAL_DOCKER_FORWARD_ENV: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const HERMES_SESSION_ID: string;
	export const BROWSER_SESSION_TIMEOUT: string;
	export const TERMINAL_CONTAINER_DISK: string;
	export const HERMES_EXEC_ASK: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		HERMES_HOME: string;
		HERMES_GATEWAY_SESSION: string;
		HERMES_DASHBOARD_TUI: string;
		AGENT_BROWSER_EXECUTABLE_PATH: string;
		TERMINAL_PERSISTENT_SHELL: string;
		TERMINAL_DOCKER_ENV: string;
		TERMINAL_CONTAINER_CPU: string;
		TELEGRAM_ALLOWED_CHATS: string;
		NODE: string;
		INIT_CWD: string;
		BROWSER_INACTIVITY_TIMEOUT: string;
		SHELL: string;
		DISCORD_HISTORY_BACKFILL: string;
		TMPDIR: string;
		TERMINAL_LIFETIME_SECONDS: string;
		HOMEBREW_REPOSITORY: string;
		PYTHONUNBUFFERED: string;
		TERMINAL_DOCKER_VOLUMES: string;
		HERMES_QUIET: string;
		VISION_TOOLS_DEBUG: string;
		TERMINAL_ENV: string;
		TAURI_CLI_VERBOSITY: string;
		MallocNanoZone: string;
		HERMES_DASHBOARD_SESSION_TOKEN: string;
		DISCORD_ALLOWED_CHANNELS: string;
		TAURI_ENV_DEBUG: string;
		MOA_TOOLS_DEBUG: string;
		TERMINAL_CONTAINER_PERSISTENT: string;
		USER: string;
		WEB_TOOLS_DEBUG: string;
		TAURI_ENV_TARGET_TRIPLE: string;
		COMMAND_MODE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		MATRIX_ALLOWED_ROOMS: string;
		IMAGE_TOOLS_DEBUG: string;
		npm_execpath: string;
		TAURI_ENV_PLATFORM: string;
		TERMINAL_SINGULARITY_IMAGE: string;
		SLACK_REQUIRE_MENTION: string;
		SLACK_ALLOWED_CHANNELS: string;
		PATH: string;
		npm_package_json: string;
		__CFBundleIdentifier: string;
		TAURI_ENV_PLATFORM_VERSION: string;
		TAURI_ENV_FAMILY: string;
		HERMES_REDACT_SECRETS: string;
		BROWSERBASE_ADVANCED_STEALTH: string;
		TERMINAL_DAYTONA_IMAGE: string;
		PWD: string;
		npm_command: string;
		npm_lifecycle_event: string;
		TERMINAL_DOCKER_MOUNT_CWD_TO_WORKSPACE: string;
		npm_package_name: string;
		NODE_PATH: string;
		DISCORD_HISTORY_BACKFILL_LIMIT: string;
		XPC_FLAGS: string;
		HERMES_INTERACTIVE: string;
		TERMINAL_TIMEOUT: string;
		TERMINAL_MODAL_IMAGE: string;
		TAURI_ENV_ARCH: string;
		TERMINAL_DOCKER_IMAGE: string;
		TERMINAL_CONTAINER_MEMORY: string;
		npm_config_node_gyp: string;
		pnpm_config_verify_deps_before_run: string;
		XPC_SERVICE_NAME: string;
		TERMINAL_CWD: string;
		npm_package_version: string;
		TELEGRAM_REACTIONS: string;
		SHLVL: string;
		HOME: string;
		HOMEBREW_PREFIX: string;
		DISCORD_REACTIONS: string;
		PYTHONPATH: string;
		LOGNAME: string;
		SLACK_FREE_RESPONSE_CHANNELS: string;
		HERMES_WEB_DIST: string;
		npm_lifecycle_script: string;
		LC_CTYPE: string;
		BROWSERBASE_PROXIES: string;
		DISCORD_THREAD_REQUIRE_MENTION: string;
		npm_config_user_agent: string;
		TERMINAL_DOCKER_RUN_AS_HOST_USER: string;
		TERMINAL_DOCKER_FORWARD_ENV: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		HERMES_SESSION_ID: string;
		BROWSER_SESSION_TIMEOUT: string;
		TERMINAL_CONTAINER_DISK: string;
		HERMES_EXEC_ASK: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
