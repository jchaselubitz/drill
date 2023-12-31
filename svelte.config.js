import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		// vite: {
		// server: {
		// 	middlewareMode: 'ssr'
		// },
		// resolve: {
		alias: {
			$lib: './src/lib',
			'$lib/*': './src/lib/*',
			'$src/*': './src/*',
			'$types/*': './src/types/*'
		}
		// }
		// }
	}
};

export default config;
