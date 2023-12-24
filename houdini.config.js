import('houdini').ConfigFile;

const config = {
	watchSchema: {
		url: 'http://localhost:8080/graphql'
	},
	plugins: {
		'houdini-svelte': {}
	}

	// scalars: {
	// 	// the name of the scalar we are configuring
	// 	DateTime: {
	// 		// the corresponding typescript type
	// 		type: 'Date',
	// 		// turn the api's response into that type
	// 		unmarshal(val) {
	// 			return val ? new Date(val) : null;
	// 		},
	// 		// turn the value into something the API can use
	// 		marshal(date) {
	// 			return date && date.getTime();
	// 		}
	// 	}
	// }
};

export default config;
