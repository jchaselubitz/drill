import type { Lesson, Phrase } from '$src/types/primaryTypes';
import { hashString } from '$src/utils/helpersDB';
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

	async function getUrl(text: string, bucket: string) {
		const fileName = (await hashString(text)) + '.mp3';
		const { data } = locals.supabase.storage
			.from(bucket)
			.getPublicUrl(fileName, { download: true });

		if (data) {
			return data;
		}
		return false;
	}

	const lesson = lessons ? (lessons[0] as any) : ({} as Lesson);

	const createExportArray = async () =>
		await Promise.all(
			lesson.translations?.map(async (translation: any) => {
				const primary = translation.phrase_primary_id as Phrase;
				const secondary = translation.phrase_secondary_id as Phrase;
				const fileUrl = await getUrl(secondary.text as string, 'text_to_speech');

				return {
					[primary.lang as any]: primary.text,
					[secondary.lang as any]: secondary.text,
					['media' as any]: fileUrl.publicUrl
				};
			})
		);

	const arrayForExport = await createExportArray();

	const headers = Object.keys(arrayForExport[0]);

	const csvContent = arrayForExport.map((row: any) => {
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
