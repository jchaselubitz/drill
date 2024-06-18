import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');
	const supabase = createSupabaseLoadClient({
		supabaseUrl: VITE_SUPABASE_URL,
		supabaseKey: VITE_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const { data: userData } = await supabase.from('profiles').select('*');

	const language = userData && userData[0] && userData[0].language ? userData[0].language : 'none';

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return {
		supabase,
		session,
		url: data.url,
		pathname: data.pathname,
		code: data.code,
		userLanguage: language
	};
};
