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
			$houdini: './$houdini',
			$lib: './src/lib',
			'$lib/*': './src/lib/*',
			'$src/*': './src/*'
		}
		// }
		// }
	}
};

export default config;
