import type { SupabaseClient } from '@supabase/supabase-js';
import { getOpenAiKey } from './helpersAI';

export type PlaySpeechProps = {
	fileName: string;
	supabase: SupabaseClient<any, 'public', any>;
	bucket: string;
	setIsloadingFalse: () => void;
};

export type GetAudioFileProps = PlaySpeechProps & {
	text: string;
};

export async function getAudioFile({
	text,
	fileName,
	supabase,
	bucket,
	setIsloadingFalse
}: GetAudioFileProps) {
	const apiKey = getOpenAiKey();
	fetch(`/api/AI`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ apiKey, text, fileName })
	})
		.then((res) => res.json())
		.then((data) => {
			playSpeech({ fileName: data.data, supabase, bucket, setIsloadingFalse });
			return data;
		})
		.catch((err) => console.log(err));
}

export async function playSpeech({
	fileName,
	supabase,
	bucket,
	setIsloadingFalse
}: PlaySpeechProps) {
	const { data: existingFile, error: existingError } = await supabase.storage
		.from(bucket)
		.download(fileName);

	if (existingFile) {
		const url = URL.createObjectURL(existingFile);
		const audio = new Audio(url);
		audio.play();
		audio.onended = () => {
			URL.revokeObjectURL(url);
			setIsloadingFalse();
		};
		return true;
	}
	return false;
}