export const load = async ({ locals }) => {
	const session = await locals.getSession();
	const userId = session?.user?.id;
	const { data, error } = await locals.supabase.from('subjects').select('*').eq('user_id', userId);

	if (error) {
		console.error('Error fetching subjects:', error);
		return { subjects: [] };
	}

	return {
		subjects: data ?? []
	};
};
