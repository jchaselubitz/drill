import type { Lesson, Phrase } from '$src/types/primaryTypes';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	const lessonId = params.lessonId;
	const { data: lessons, error: errorLessons } = await locals.supabase
		.from('lessons')
		.select(
			'id, title, translations ( phrase_primary_id (text, lang), phrase_secondary_id (text, lang))'
		)
		.eq('id', lessonId);

	if (errorLessons) {
		return new Response(errorLessons.message, { status: 500 });
	}

	const lesson = lessons ? (lessons[0] as any) : ({} as Lesson);

	const exportArray = lesson.translations?.map((translation: any) => {
		const primary = translation.phrase_primary_id as Phrase;
		const secondary = translation.phrase_secondary_id as Phrase;

		return {
			[primary.lang as any]: primary.text,
			[secondary.lang as any]: secondary.text
		};
	});

	const headers = Object.keys(exportArray[0]);

	const csvContent = exportArray.map((row: any) => {
		return headers.map((header) => `"${row[header].replace(/"/g, '""')}"`).join(',');
	});

	const csvOutput = [...csvContent].join('\n');

	return new Response(csvOutput, {
		headers: {
			'Content-Disposition': 'attachment; filename=export.csv',
			'Content-Type': 'text/csv'
		}
	});
};
