// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { getSession, supabase } }) => {
	const { data } = await supabase.from('subjects').select('*');
	return { url: url.origin, subjects: data ?? [] };
};
