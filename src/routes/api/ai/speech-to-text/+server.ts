import OpenAI from 'openai';
import type { RequestHandler } from '@sveltejs/kit';
import type { Uploadable } from 'openai/uploads.mjs';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const apiKey = data.get('apiKey') as string;
	const OpenAiKey = import.meta.env.VITE_OPENAI_API_KEY;
	const audioFile = data.get('audioFile');

	const openai = new OpenAI({
		apiKey: apiKey ? apiKey : OpenAiKey
	});

	try {
		const transcription = await openai.audio.transcriptions.create({
			file: audioFile as Uploadable,
			model: 'whisper-1'
		});
		return new Response(JSON.stringify({ data: transcription.text }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error processing your request' }), {
			status: 500, // Internal Server Error
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
