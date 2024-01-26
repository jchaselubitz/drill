import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	const session = await locals.getSession();
	const userId = session?.user?.id;

	const { data: recordings } = await locals.supabase
		.from('recordings')
		.select('*')
		.eq('user_id', userId);

	depends('app:my-content');

	return {
		recordings: recordings ?? []
	};
};
