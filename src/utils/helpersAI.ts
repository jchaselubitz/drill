import axios from 'axios';
import OpenAI from 'openai';

export type AiMessage = {
	role: string;
	content: string;
};

export enum OpenAiModel {
	'gpt3' = 'gpt-3.5-turbo-1106',
	'gpt4' = 'gpt-4-1106-preview'
}

export const getModelSelection = () => {
	if (typeof window !== 'undefined') {
		const selection = localStorage.getItem('OpenAIModel') ?? 'gpt3';
		return selection === 'gpt4' ? OpenAiModel.gpt4 : OpenAiModel.gpt3;
	}
};
export const getOpenAiKey = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('OpenAIKey') ?? '';
	}
};
const OpenAiUrl = import.meta.env.VITE_OPENAI_CHAT_URL;

const createOpenAI = () => {
	if (typeof window !== 'undefined') {
		return new OpenAI({
			apiKey: localStorage.getItem('OpenAIKey') ?? '',
			dangerouslyAllowBrowser: true
		});
	}
};

export type gptFormatType = 'json_object' | 'text';
export type ModelParamsType = {
	format: gptFormatType;
	presence_penalty?: number;
	frequency_penalty?: number;
	temperature?: number;
	max_tokens?: number;
};

export type AiGenerateProps = {
	modelParams: ModelParamsType;
	messages: AiMessage[];
	dbParams?: any;
	dbCallback?: any;
};

export const genText = async ({ modelParams, messages, dbParams, dbCallback }: AiGenerateProps) => {
	const OpenAiKey = getOpenAiKey();

	const {
		format = 'json_object',
		presence_penalty = 0,
		frequency_penalty = 0,
		temperature = 0.5,
		max_tokens = 3500
	} = modelParams;

	const payload = {
		model: getModelSelection(),
		messages: messages,
		response_format: { type: format },
		presence_penalty,
		frequency_penalty,
		temperature,
		max_tokens
	};
	try {
		const response = await axios.post(OpenAiUrl, payload, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OpenAiKey}`
			}
		});
		const assistantMessage = response.data.choices[0].message.content;
		return assistantMessage;
	} catch (error: any) {
		console.error('OpenAI API Error:', error.response?.data, error.response?.message);
	}
};
