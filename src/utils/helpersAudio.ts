import type { SupabaseClient } from '@supabase/supabase-js';
import { getOpenAiKey } from './helpersAI';

export type GetTextFromSpeechProps = {
	audioFile: Blob;
	setIsloadingFalse: () => void;
};

export type GetAudioFileProps = PlaySavedAudio & {
	text: string;
	setIsLoadingFalse: () => void;
};

export async function getAudioFile({
	text,
	fileName,
	supabase,
	bucket,
	setIsPlayingFalse,
	setIsLoadingFalse
}: GetAudioFileProps) {
	const apiKey = getOpenAiKey();

	fetch(`/api/ai/text-to-speech`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ apiKey, text, fileName })
	})
		.then((res) => res.json())
		.then((data) => {
			setIsLoadingFalse();
			playSavedAudio({ fileName: data.data, supabase, bucket, setIsPlayingFalse });
			return data;
		})
		.catch((err) => {
			throw err;
		});
}

export type PlaySavedAudio = {
	fileName: string;
	supabase: SupabaseClient<any, 'public', any>;
	bucket: string;
	setIsPlayingFalse: () => void;
};

export async function playSavedAudio({
	fileName,
	supabase,
	bucket,
	setIsPlayingFalse
}: PlaySavedAudio) {
	const { data: existingFile, error: existingError } = await supabase.storage
		.from(bucket)
		.download(fileName);

	if (existingError) {
		setIsPlayingFalse();
		return;
	}

	if (existingFile) {
		const audioBlob = new Blob([existingFile], { type: 'audio/mpeg' });
		const url = URL.createObjectURL(audioBlob);
		const audio = new Audio(url);
		audio.play().catch((e) => {
			console.error('Error playing audio:', e);
		});

		audio.onended = () => {
			URL.revokeObjectURL(url);
			setIsPlayingFalse();
		};

		return audio;
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
		setIsloadingFalse && setIsloadingFalse();
		throw error;
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
			// const options = { mimeType: 'audio/mpeg' };
			const mediaRecorder = new MediaRecorder(stream);
			const audioChunks: Blob[] = [];
			mediaRecorder.addEventListener('dataavailable', (event) => {
				audioChunks.push(event.data);
				console.log(mediaRecorder.mimeType);
			});

			const start = () => {
				mediaRecorder.start(1000);
			};

			const stop = () => {
				return new Promise<{ blob: Blob; url: string }>((resolve) => {
					mediaRecorder.addEventListener('stop', () => {
						const blob = new Blob(audioChunks, { type: 'audio/mp4' });
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
