export const load = async ({ locals: { getSession }, url }) => {
	const session = await getSession();
	return {
		session: session,
		url: url.origin
	};
};
