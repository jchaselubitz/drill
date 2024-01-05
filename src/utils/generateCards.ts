import axios from 'axios';

export type AiMessage = {
	role: string;
	content: string;
};

export enum OpenAiModel {
	'gpt3' = 'gpt-3.5-turbo-1106',
	'gpt4' = 'gpt-4-1106-preview'
}

const OpenAiUrl = import.meta.env.VITE_OPENAI_CHAT_URL;

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

export type ModelParamsType = {
	format: 'json_object' | 'text';
	presence_penalty?: number;
	frequency_penalty?: number;
	temperature?: number;
	max_tokens?: number;
};

export type AiGenerateProps = {
	modelParams: ModelParamsType;
	messages: AiMessage[];
	localStorage: any;
	dbParams: any;
	dbCallback: any;
};

export const aiGenerate = async ({
	modelParams,
	messages,
	localStorage,
	dbParams,
	dbCallback
}: AiGenerateProps) => {
	const OpenAiKey = getOpenAiKey();
	const {
		format,
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
