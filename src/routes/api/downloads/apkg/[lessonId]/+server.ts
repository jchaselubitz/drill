import AnkiExport from 'anki-apkg-export';
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

	const apkg = new AnkiExport.default(lesson.title);

	lesson.translations?.forEach((translation: any) => {
		const primary = translation.phrase_primary_id as Phrase;
		const secondary = translation.phrase_secondary_id as Phrase;

		apkg.addCard(primary.text, secondary.text);
	});

	try {
		const zip = await apkg.save();

		return new Response(zip, {
			headers: {
				'Content-Disposition': 'attachment; filename="export.apkg"',
				'Content-Type': 'application/octet-stream'
			}
		});
	} catch (err) {
		console.error(err.stack || err);
		return new Response('Internal Server Error', { status: 500 });
	}
};
