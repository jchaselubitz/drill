import type { Actions } from './$types';
import {
	cardGenerationSystemInstructions,
	lessonGenerationSystemInstructions,
	requestCardSuggestions,
	requestLessonSuggestions
} from '$src/utils/promptGenerators';
import { redirect } from '@sveltejs/kit';
import axios from 'axios';

const OPENAI_URL = import.meta.env.VITE_OPENAI_CHAT_URL;
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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
		throw Error('Error saving cards to db:', error);
	}
};

export const actions = {
	genLessons: async ({ request, locals }) => {
		const data = await request.formData();
		const level = data.get('level');
		const language = data.get('language');
		const modelSelection = data.get('modelSelection');
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
					Authorization: `Bearer ${OPENAI_KEY}`
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
					Authorization: `Bearer ${OPENAI_KEY}`
				}
			});
			const assistantMessage = response.data.choices[0].message.content;
			const cardsJson = JSON.parse(`[${assistantMessage}]`).flat();
			if (cardsJson.length === 0) {
				return { result: 'No cards generated. Try again.' };
			}
			const result = await createSubjectLessonCards({
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
			console.error('OpenAI API Error:', error);
		}
	}
};
