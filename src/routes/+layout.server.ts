export const load = async ({ locals: { getSession }, url }) => {
	const code = url.searchParams.get('code');
	const session = await getSession();
	return {
		session: session,
		url: url.origin,
		pathname: url.pathname,
		code: code
	};
};
