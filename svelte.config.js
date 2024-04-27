import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		files: {
			lib: 'source/library',
			params: 'source/parameters',
			routes: 'source/routes',
			serviceWorker: 'source/service-worker',
			appTemplate: 'source/index.html',
			errorTemplate: 'source/error.html',
			hooks: {
				server: 'source/hook.server',
				client: 'source/hook.client',
				universal: 'source/hook'
			}
		},
		typescript: {
			config: function (config) {
				config['include'].push('../source/**/*.ts');
				
				return config;
			}
		}
	}
};