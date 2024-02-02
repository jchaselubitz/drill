import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	const session = await locals.getSession();
	const userId = session?.user?.id;

	const { data: recordings } = await locals.supabase
		.from('recordings')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	depends('app:my-media');

	return {
		recordings: recordings ?? []
	};
};
