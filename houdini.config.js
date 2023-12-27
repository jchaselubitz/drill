import('houdini').ConfigFile;
// import { rfc3339 } from './src/utils/helpersDate'; // adjust the path to where your rfc3339 function is defined

const config = {
	watchSchema: {
		url: 'http://localhost:8080/graphql'
	},
	plugins: {
		'houdini-svelte': {}
	},
	include: ['src/**/*.{svelte,graphql,gql,ts,js}'],
	scalars: {
		DateTime: {
			type: 'Date'
			// 			unmarshal(val) {
			// 				return val ? new Date(val) : null;
			// 			},
			// 			marshal(date) {
			// 				return date ? rfc3339(date) : null;
			// 			}
		}
	}
};

export default config;
