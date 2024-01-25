import type { SupabaseClient } from '@supabase/supabase-js';
import { getOpenAiKey } from './helpersAI';

export type GetAudioFileProps = PlaySavedAudio & {
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
	if (!apiKey) {
		alert('OpenAI Key not found. Sign up for one at https://platform.openai.com/api-keys');
		setIsloadingFalse();
		return;
	}

	fetch(`/api/ai/text-to-speech`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ apiKey, text, fileName })
	})
		.then((res) => res.json())
		.then((data) => {
			playSavedAudio({ fileName: data.data, supabase, bucket, setIsloadingFalse });
			return data;
		})
		.catch((err) => console.log(err));
}

export type GetTextFromSpeechProps = {
	audioFile: Blob;
	setIsloadingFalse: () => void;
};

export async function getTextFromSpeech({
	audioFile,
	setIsloadingFalse
}: GetTextFromSpeechProps): Promise<{ data: string }> {
	const apiKey = getOpenAiKey();
	if (!apiKey) {
		alert('OpenAI Key not found. Sign up for one at https://platform.openai.com/api-keys');
		setIsloadingFalse();
		return { data: '' };
	}

	const formData = new FormData();
	formData.append('apiKey', apiKey);
	formData.append('audioFile', audioFile, 'recording.webm');

	return fetch(`/api/ai/speech-to-text`, {
		method: 'POST',
		body: formData
	})
		.then((res) => res.json())
		.then((data) => {
			setIsloadingFalse;
			return data;
		})
		.catch((err) => console.log(err));
}

export type PlaySavedAudio = {
	fileName: string;
	supabase: SupabaseClient<any, 'public', any>;
	bucket: string;
	setIsloadingFalse: () => void;
};

export async function playSavedAudio({
	fileName,
	supabase,
	bucket,
	setIsloadingFalse
}: PlaySavedAudio) {
	const { data: existingFile, error: existingError } = await supabase.storage
		.from(bucket)
		.download(fileName);

	if (existingFile) {
		const audioBlob = new Blob([existingFile], { type: 'audio/mpeg' });
		const url = URL.createObjectURL(audioBlob);
		const audio = new Audio(url);
		audio.play().catch((e) => {
			console.error('Error playing audio:', e);
		});

		audio.onended = () => {
			URL.revokeObjectURL(url);
			setIsloadingFalse();
		};
		return true;
	}
	return false;
}

export type SaveAudioFileProps = {
	audioFile: Blob;
	fileName: string;
	path: string;
	supabase: SupabaseClient<any, 'public', any>;
	bucketName: string;
	setIsloadingFalse?: () => void;
};

export async function savePrivateAudioFile({
	fileName,
	path,
	supabase,
	bucketName,
	audioFile,
	setIsloadingFalse
}: SaveAudioFileProps) {
	const { data, error } = await supabase.storage
		.from(bucketName)
		.upload(`${path}/${fileName}`, audioFile);

	if (error) {
		console.error(error);
		setIsloadingFalse && setIsloadingFalse();
		return;
	}
	return data;
}

interface RecordAudioResult {
	start: () => void;
	stop: () => Promise<{ blob: Blob; url: string }>;
}

export function recordAudio() {
	return new Promise<RecordAudioResult>((resolve) => {
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			const options = { mimeType: 'audio/webm' };
			const mediaRecorder = new MediaRecorder(stream, options);
			const audioChunks: Blob[] = [];
			mediaRecorder.addEventListener('dataavailable', (event) => {
				audioChunks.push(event.data);
			});

			const start = () => {
				mediaRecorder.start();
			};

			const stop = () => {
				return new Promise<{ blob: Blob; url: string }>((resolve) => {
					mediaRecorder.addEventListener('stop', () => {
						const blob = new Blob(audioChunks, { type: 'audio/webm' });
						const url = URL.createObjectURL(blob);
						stream.getTracks().forEach((track) => track.stop());
						resolve({ blob, url });
					});

					mediaRecorder.stop();
				});
			};

			resolve({ start, stop });
		});
	});
}
