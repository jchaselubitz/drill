import type { Card, Lesson } from '$src/types/primaryTypes';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	const lessonId = params.lessonId;
	const { data: lessons, error: errorLessons } = await locals.supabase
		.from('lessons')
		.select('id, title, cards (*)')
		.eq('id', lessonId);

	if (errorLessons) {
		return new Response(errorLessons.message, { status: 500 });
	}
	const lesson = lessons ? (lessons[0] as Lesson) : ({} as Lesson);
	const cards = lesson.cards ?? [];
	const csvContent = cards.map((card) => Object.values(card).join(',')).join('\n');

	return new Response(csvContent, {
		headers: {
			'Content-Disposition': `attachment`,
			'Content-Type': 'text/csv'
		}
	});
};
