import('houdini').ConfigFile;

const config = {
	watchSchema: {
		url: 'http://localhost:8080/graphql'
	},
	plugins: {
		'houdini-svelte': {}
	}
};

export default config;
