import { HoudiniClient } from '$houdini';

const isSSR = import.meta.env.SSR;

export default new HoudiniClient({
	url: isSSR ? 'http://alpha:8080/graphql' : 'http://localhost:8080/graphql'
	// uncomment this to configure the network call (for things like authentication)
	// for more information, please visit here: https://www.houdinigraphql.com/guides/authentication
	// fetchParams({ session }) {
	//     return {
	//         headers: {
	//             Authentication: `Bearer ${session.token}`,
	//         }
	//     }
	// }
});
