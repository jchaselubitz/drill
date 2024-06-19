import OpenAI from 'openai';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { apiKey, text, fileName } = await request.json();
	const OpenAiKey = import.meta.env.VITE_OPENAI_API_KEY;

	async function genSpeech() {
		const bucketName = 'text_to_speech';
		const openai = new OpenAI({
			apiKey: apiKey ? apiKey : OpenAiKey
		});
		console.time('openai-tts');
		const mp3 = await openai.audio.speech.create({
			model: 'tts-1',
			voice: 'alloy',
			input: text
		});

		const buffer = Buffer.from(await mp3.arrayBuffer());
		console.timeEnd('openai-tts');
		console.time('upload-speech');
		const { data, error } = await locals.supabase.storage.from(bucketName).upload(fileName, buffer);

		console.timeEnd('upload-speech');
		if (error) {
			return { error };
		}

		return { data: data.path };
	}

	const result = await genSpeech();
	return new Response(JSON.stringify(result), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
