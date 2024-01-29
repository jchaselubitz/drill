import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	const data = await req.json();
	const modelSelection = data.modelSelection;
	const modelParams = data.modelParams;
	const messages = data.messages;

	try {
		const apiKey = Deno.env.get('OPENAI_API_KEY');
		const openai = new OpenAI({
			apiKey: apiKey
		});

		const {
			format = 'json_object',
			presence_penalty = 0,
			frequency_penalty = 0,
			temperature = 0.5,
			max_tokens = 3500,
			stream = false
		} = modelParams;

		const completion = await openai.chat.completions.create({
			model: modelSelection,
			messages: messages,
			response_format: { type: format },
			presence_penalty,
			frequency_penalty,
			temperature,
			max_tokens,
			stream
		});

		const reply = completion.choices[0].message.content;

		return new Response(JSON.stringify(reply), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 400
		});
	}
});

//Instructions: https://supabase.com/docs/guides/ai/examples/openai
