export async function load({ locals, params, depends }) {
	const subjectId = params.subjectId; // Get the subjectId parameter from the URL
	const { data: subjects } = await locals.supabase.from('subjects').select('*').eq('id', subjectId); // Filter the query by subjectId
	const { data: lessons } = await locals.supabase
		.from('lessons')
		.select('*')
		.eq('subject_id', subjectId); // Filter the query by subjectId

	depends('app:generated-lesson');
	const subject = subjects ? subjects[0] : {};
	return {
		subject: subject,
		lessons: lessons ?? []
	};
}
