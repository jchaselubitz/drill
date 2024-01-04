import axios from 'axios';
import { cardGenerationSystemInstructions, requestCardSuggestions } from './promptGenerators';

export type AiMessage = {
	role: string;
	content: string;
};

export enum OpenAiModel {
	'gpt3' = 'gpt-3.5-turbo',
	'gpt4' = 'gpt-4-1106-preview'
}

export const getModelSelection = (localStorage) => {
	const selection = localStorage.getItem('OpenAIModel') ?? 'gpt3';
	return selection === 'gpt4' ? OpenAiModel.gpt4 : OpenAiModel.gpt3;
};

const OpenAiUrl = import.meta.env.VITE_OPENAI_CHAT_URL;
// const OpenAiKey = localStorage.getItem('OpenAIKey') ?? '';
// const ModelSelection = localStorage.getItem('OpenAIModel') ?? 'gpt3';

export const generateCards = async (messages: AiMessage) => {
	const payload = {
		model: getModelSelection,
		messages: messages,
		presence_penalty: 0,
		frequency_penalty: 0,
		temperature: 0.5,
		max_tokens: 3000
	};
	try {
		const response = await axios.post(OpenAiUrl, payload, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OpenAiKey}`
			}
		});
		const assistantMessage = response.data.choices[0].message.content;
		return { result: JSON.parse(`[${assistantMessage}]`).flat() };
	} catch (error: any) {
		console.error('OpenAI API Error:', error.response?.data, error.response?.message);
	}
};
