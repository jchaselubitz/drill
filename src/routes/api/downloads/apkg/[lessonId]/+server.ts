import AnkiExport from 'anki-apkg-export';
import type { Lesson, Phrase } from '$src/types/primaryTypes';
import type { RequestHandler } from './$types';
import { hashString } from '$src/utils/helpersDB';

export const POST: RequestHandler = async ({ params, locals }) => {
	const lessonId = params.lessonId;
	const bucket = 'text_to_speech';

	const storage = locals.supabase.storage;
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

	async function downloadMedia(fileName: string) {
		const { data, error } = await storage.from(bucket).download(fileName);
		if (error) {
			return null;
		}
		const audioBlob = new Blob([data], { type: 'audio/mpeg' });
		const arrayBuffer = await audioBlob.arrayBuffer(); // Convert the data to ArrayBuffer
		return arrayBuffer;
	}

	const apkg = new AnkiExport.default(lesson.title);

	const createMediaPackage = async () => {
		await Promise.all(
			lesson.translations?.map(async (translation: any) => {
				const primary = translation.phrase_primary_id as Phrase;
				const secondary = translation.phrase_secondary_id as Phrase;
				if (!primary.text || !secondary.text) return;
				const fileName = (await hashString(secondary.text)) + '.mp3';
				const media = await downloadMedia(fileName);
				apkg.addMedia(`${fileName}`, media);
				apkg.addCard(primary.text, `${secondary.text} [sound:${fileName}]`);
			})
		);
		return await apkg.save();
	};
	try {
		const zip = await createMediaPackage();

		return new Response(zip, {
			headers: {
				'Content-Disposition': 'attachment; filename="export.apkg"',
				'Content-Type': 'application/octet-stream'
			}
		});
	} catch (err) {
		console.error(err);
		return new Response('Internal Server Error', { status: 500 });
	}
};
