import {
	cardGenerationSystemInstructions,
	lessonGenerationSystemInstructions,
	requestCardSuggestions,
	requestLessonSuggestions
} from '$src/utils/promptGenerators';
import { redirect } from '@sveltejs/kit';
import axios from 'axios';

export async function load({ locals, params }) {
	const subjectId = params.subjectId; // Get the subjectId parameter from the URL
	const { data: subjects } = await locals.supabase.from('subjects').select('*').eq('id', subjectId); // Filter the query by subjectId
	const { data: lessons } = await locals.supabase
		.from('lessons')
		.select('*')
		.eq('subject_id', subjectId); // Filter the query by subjectId

	const subject = subjects ? subjects[0] : {};
	return {
		subject: subject,
		lessons: lessons ?? []
	};
}

const OPENAI_URL = import.meta.env.VITE_OPENAI_CHAT_URL;

type CreateSubjectLessonCardsProps = {
	subjectId: string;
	lessonTitle: FormDataEntryValue | null | string;
	lessonDescription: FormDataEntryValue | null | string;
	currentLevel: FormDataEntryValue | null | string;
	language: FormDataEntryValue | null | string;
	cards: any;
	supabase: any;
	userId: string | undefined;
};

const createSubjectLessonCards = async ({
	subjectId,
	lessonTitle,
	lessonDescription,
	currentLevel,
	language,
	cards,
	supabase,
	userId
}: CreateSubjectLessonCardsProps) => {
	const { data, error } = await supabase.rpc('create_subject_lesson_cards', {
		_subject_id: subjectId,
		_user_id: userId,
		_subject_name: language,
		_current_level: currentLevel,
		_lesson_title: lessonTitle,
		_lesson_description: lessonDescription,
		_cards: cards
	});
	if (data) {
		return data;
	}
	if (error) {
		console.log('Error saving cards to db:', error);
		throw Error('Error saving cards to db:', error);
	}
};

export const actions = {
	genLessons: async ({ request, locals }) => {
		const data = await request.formData();
		const level = data.get('level');
		const language = data.get('language');
		const modelSelection = data.get('modelSelection');
		const openApiKey = data.get('openApiKey');
		const session = await locals.getSession();
		if (!session) {
			throw redirect(301, 'auth/sign-in');
		}

		const payload = {
			model: modelSelection ?? 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: lessonGenerationSystemInstructions
				},
				{ role: 'user', content: requestLessonSuggestions({ level, language }) }
			],
			presence_penalty: 0,
			frequency_penalty: 0,
			temperature: 0.5,
			max_tokens: 3000
		};
		try {
			const response = await axios.post(OPENAI_URL, payload, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${openApiKey}`
				}
			});
			const assistantMessage = response.data.choices[0].message.content;
			return { result: assistantMessage };
		} catch (error: any) {
			console.error('OpenAI API Error:', error);
		}
	},

	genCards: async ({ request, locals, params }) => {
		const subjectId = params.subjectId;
		const data = await request.formData();
		const modelSelection = data.get('modelSelection');
		const openApiKey = data.get('openApiKey');
		const lessonTitle = data.get('lessonTitle');
		const lessonDescription = data.get('lessonDescription');
		const currentLevel = data.get('currentLevel');
		const subjectLanguage = data.get('subjectLanguage');
		const session = await locals.getSession();
		const messages = [
			{
				role: 'system',
				content: cardGenerationSystemInstructions({
					concept: lessonTitle,
					keyName: 'side_1',
					valueName: 'side_2'
				})
			},
			{
				role: 'user',
				content: requestCardSuggestions({
					concept: lessonTitle,
					subject: subjectLanguage
				})
			}
		];

		const payload = {
			model: modelSelection ?? 'gpt-3.5-turbo',
			messages: messages,
			presence_penalty: 0,
			frequency_penalty: 0,
			temperature: 0.5,
			max_tokens: 3000
		};
		try {
			const response = await axios.post(OPENAI_URL, payload, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${openApiKey}`
				}
			});
			const assistantMessage = response.data.choices[0].message.content;
			const cardsJson = JSON.parse(`[${assistantMessage}]`).flat();
			// const cardsJson = JSON.parse(`[{"side_1":"german", "side_2":"english"}]`).flat();
			if (cardsJson.length === 0) {
				return { result: 'No cards generated. Try again.' };
			}
			const result = await createSubjectLessonCards({
				subjectId: subjectId,
				lessonTitle,
				lessonDescription,
				currentLevel,
				language: subjectLanguage,
				cards: cardsJson,
				supabase: locals.supabase,
				userId: session?.user?.id
			});
			return { result: result };
		} catch (error: any) {
			console.error('OpenAI API Card Gen Error:', error);
		}
	}
};
