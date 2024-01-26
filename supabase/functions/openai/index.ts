import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';

Deno.serve(async (req) => {
	const query = await req.json();
	// console.log(query);
	const apiKey = Deno.env.get('OPENAI_API_KEY');
	const openai = new OpenAI({
		apiKey: apiKey
	});

	const completion = await openai.chat.completions.create({
		messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
		model: 'gpt-3.5-turbo-1106',
		stream: false
	});

	const reply = completion.choices[0].message.content;

	return new Response(reply, {
		headers: { 'Content-Type': 'text/plain' }
	});
});

//Instructions: https://supabase.com/docs/guides/ai/examples/openai
