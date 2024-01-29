import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// CANT GET THIS TO WORK: SUPABASE STORAGE REFUSING CONNECTION
Deno.serve(async (req) => {
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	const data = await req.json();
	const userApiKey = data.userApiKey;
	const text = data.text;
	const fileName = data.fileName;
	const bucketName = 'text_to_speech';

	const supabaseClient = createClient(
		Deno.env.get('DB_SUPABASE_URL') ?? '',
		Deno.env.get('DB_SUPABASE_ANON_KEY') ?? '',
		{
			global: {
				headers: { Authorization: req.headers.get('Authorization')! }
			}
		}
	);

	const openai = new OpenAI({
		apiKey: userApiKey ? userApiKey : Deno.env.get('OPENAI_API_KEY')
	});

	const mp3 = await openai.audio.speech.create({
		model: 'tts-1',
		voice: 'alloy',
		input: text
	});

	const arrayBuffer = await mp3.arrayBuffer();
	const uint8Array = new Uint8Array(arrayBuffer);

	const { data: storageData, error } = await supabaseClient.storage
		.from(bucketName)
		.upload(fileName, uint8Array);

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 400
		});
	}

	if (storageData) {
		return new Response(JSON.stringify(storageData), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 200
		});
	}

	return new Response('Method not allowed', {
		status: 405,
		headers: corsHeaders
	});
});
