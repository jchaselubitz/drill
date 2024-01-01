import type { Actions } from './$types';
import {
	lessonGenerationSystemInstructions,
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

export const actions = {
	genLessons: async ({ request, locals }) => {
		const data = await request.formData();
		const level = data.get('level');
		const language = data.get('language');
		const session = await locals.getSession();
		if (!session) {
			throw redirect(301, 'auth/sign-in');
		}
		try {
			const response = await axios.post(
				OPENAI_URL,
				{
					model: 'gpt-3.5-turbo',
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
					max_tokens: 1000
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${OPENAI_KEY}`
					}
				}
			);
			const assistantMessage = response.data.choices[0].message.content;
			return { result: assistantMessage };
		} catch (error: any) {
			console.error('OpenAI API Error:', error.response?.data, error.response?.message);
		}
	}
};
