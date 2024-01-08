import {
	cardGenerationSystemInstructions,
	lessonGenerationSystemInstructions,
	requestCardSuggestions,
	requestLessonSuggestions
} from '$src/utils/promptGenerators';
import { redirect } from '@sveltejs/kit';
import axios from 'axios';

const OPENAI_URL = import.meta.env.VITE_OPENAI_CHAT_URL;

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

type CreateSubjectLessonCardsProps = {
	lessonTitle: FormDataEntryValue | null | string;
	lessonDescription: FormDataEntryValue | null | string;
	currentLevel: FormDataEntryValue | null | string;
	language: FormDataEntryValue | null | string;
	cards: any;
	supabase: any;
	userId: string | undefined;
};

const createSubjectLessonCards = async ({
	lessonTitle,
	lessonDescription,
	currentLevel,
	language,
	cards,
	supabase,
	userId
}: CreateSubjectLessonCardsProps) => {
	const { data, error } = await supabase.rpc('create_subject_lesson_cards', {
		_subject_id: null,
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
		const { prompt, format } = requestLessonSuggestions({ level, language });
		const payload = {
			model: modelSelection ?? 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: lessonGenerationSystemInstructions
				},
				{ role: 'user', content: prompt }
			],
			response_format: { type: format },
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

	genCards: async ({ request, locals }) => {
		const data = await request.formData();
		const modelSelection = data.get('modelSelection');
		const openApiKey = data.get('openApiKey');
		const lessonTitle = data.get('lessonTitle');
		const lessonDescription = data.get('lessonDescription');
		const currentLevel = data.get('currentLevel');
		const subjectLanguage = data.get('subjectLanguage');
		const session = await locals.getSession();

		const { prompt, format } = requestCardSuggestions({
			concept: lessonTitle,
			subject: subjectLanguage
		});
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
				content: prompt
			}
		];

		const payload = {
			model: modelSelection ?? 'gpt-3.5-turbo',
			messages: messages,
			response_format: { type: format },
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
			const cardsJson = JSON.parse(assistantMessage);
			// const cardsJson = JSON.parse(`[{"side_1":"german", "side_2":"english"}]`).flat();
			if (cardsJson.length === 0) {
				return { result: 'No cards generated. Try again.' };
			}
			console.log('reaches assistantMessage');
			const result = await createSubjectLessonCards({
				lessonTitle,
				lessonDescription,
				currentLevel,
				language: subjectLanguage,
				cards: cardsJson,
				supabase: locals.supabase,
				userId: session?.user?.id
			});
			console.log('reaches createSubjectLessonCards');
			return { result: result };
		} catch (error: any) {
			console.error('OpenAI API Card Gen Error:', error);
		}
	}
};
