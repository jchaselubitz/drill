<script lang="ts">
	import NestedObject from './NestedObject.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import {
		MOCK_ARBITRARY_RESPONSE,
		getModelSelection,
		getOpenAiKey,
		type gptFormatType
	} from '$src/utils/helpersAI';
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';
	import type { ArbitraryObject } from './types';
	import LightSuggestionList from '$lib/lesson/LightSuggestionList.svelte';
	import { LanguagesISO639, TranscriptRequestSuggestions } from '$src/utils/lists';
	import CommandTextArea from './CommandTextArea.svelte';
	import SaveTranslationItem from './SaveTranslationItem.svelte';
	import { invalidate } from '$app/navigation';

	export let text: string | null;
	export let lang: LanguagesISO639;
	export let supabase: SupabaseClient;
	export let userId: string | undefined;
	export let primaryPhraseIds: string[] = [];
	export let source: string;

	$: genResponse = [] as ArbitraryObject;
	$: requestLoading = false;

	$: console.log('genResponse:', genResponse);

	// let genResponse: any = JSON.parse(MOCK_ARBITRARY_RESPONSE);

	$: requestText = '';
	$: firstWord = requestText.split(' ')[0];

	function setCommand(firstWord: string) {
		const word = firstWord ? firstWord[0].toUpperCase() + firstWord.slice(1) : '';
		if (
			word === 'Explain' ||
			word === 'Extract' ||
			word === 'Translate' ||
			word === 'List' ||
			word === 'Generate'
		) {
			return word;
		}
	}

	function captureCommand() {
		if (setCommand(firstWord)) {
			return { request: requestText, command: setCommand(firstWord) };
		}
		return { request: requestText, command: '' };
	}

	function selectSystemMessage(command: string | undefined) {
		let message =
			'The user will send you a text and a request for how to handle that content. Return as a JSON.';
		if (command === 'Explain') {
			return (
				message + `Return a JSON with key: "explanation" and value: <a string of the explanation>.`
			);
		}

		if (command === 'Translate') {
			return (
				message +
				`If the user asks for a translation, the return value should include { "input_lang": <the ISO 639-1 code of the text>, "input_text": <text of original>, "output_text": <text of translation>, "output_lang": <the ISO 639-1 code of the translation> }.`
			);
		}

		if (command === 'List' || command === 'Extract') {
			return (
				message +
				`The user will request a list of values. Each key is presented as the title of an expandable list. If the value is an object, the component calls itself again in a nested fashion. If it is a string, it is presented to the user. The goal is to organize the data. `
			);
		}

		if (command === 'Generate') {
			return message + `The user wants you to generate new content based on the text`;
		}

		return `The user will send you a text and a request for how to handle that content. Return as a JSON. The user will often be requesting a list of values. Each key is presented as the title of an expandable list. If the value is an object, the component calls itself again in a nested fashion. If it is a string, it is presented to the user. The goal is to organize the data. If the user asks for an explanation, return a JSON with key: "explanation" and value: <a string of the explanation>. If the user asks for a translation, the return value should include { "input_lang": <the ISO 639-1 code of the text>, "input_text": <text of original>, "output_text": <text of translation>, "output_lang": <the ISO 639-1 code of the translation>}.`;
	}

	async function handleRequest() {
		requestLoading = true;
		const { request, command } = captureCommand();
		const modelParams = {
			format: 'json_object' as gptFormatType,
			max_tokens: 1000,
			temperature: 0.9
		};

		const messages = [
			{
				role: 'system',
				content: selectSystemMessage(command)
			},
			{ role: 'user', content: `text: ${text}` },
			{ role: 'user', content: `request: ${request}` }
		];

		const { data, error } = await supabase.functions.invoke('gen-text', {
			body: {
				userApiKey: getOpenAiKey(),
				modelSelection: getModelSelection(),
				modelParams: modelParams,
				messages: messages
			}
		});
		if (error) {
			console.log('Error:', error);
			requestLoading = false;
			return;
		}
		try {
			genResponse = JSON.parse(data);
		} catch (error) {
			alert('Sorry, it looks like the model returned the wrong format. Please try again.');
			console.log('Error parsing JSON:', data);
			requestLoading = false;
		}
		requestLoading = false;
	}

	async function saveContent(content: string): Promise<boolean> {
		const { error } = await supabase.from('phrases').insert([
			{
				source,
				text: content.trim(),
				lang: lang
			}
		]);
		if (error) {
			console.log('Error saving content:', error);
			throw Error(`Error saving content: ${error}`);
		}
		return true;
	}

	async function saveTranslation() {
		if (!userId) {
			console.error('No user ID');
			return;
		}

		if (primaryPhraseIds.length > 0) {
			const { data: translationId, error } = await supabase
				.rpc('add_translation_to_phrase', {
					_phrase_primary_ids: primaryPhraseIds,
					_translation: {
						phrase_secondary: {
							text: genResponse.output_text,
							lang: genResponse.output_lang,
							source: source
						}
					},
					_user_id: userId
				})
				.select();

			if (translationId) {
				invalidate('app:library');
				return translationId;
			}

			if (error) {
				console.error('Error adding translation:', error.message);
			} else {
				console.log('Added translation with ID:', translationId);
			}
		}

		const { data: translationId, error } = await supabase.rpc('add_translation', {
			_translation: {
				phrase_primary: {
					text: genResponse.input_text,
					lang: genResponse.input_lang,
					source: source
				},
				phrase_secondary: {
					text: genResponse.output_text,
					lang: genResponse.output_lang,
					source: source
				}
			},
			_user_id: userId
		});

		if (translationId) {
			invalidate('app:library');
		}

		if (error) {
			console.error('Error adding translation:', error.message);
		} else {
			console.log('Added translation with ID:', translationId);
		}

		return true;
	}

	function setMaterialSuggestion(suggestion: string) {
		requestText = suggestion;
	}
</script>

<div class="flex flex-col">
	<textarea class="input" bind:value={requestText} placeholder="Type your request here" rows="4" />
	<LoadingButton
		class="bg-blue-600 rounded-lg text-white p-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
		onClick={handleRequest}
		text={setCommand(firstWord) ?? 'Request'}
		loadingText="Requesting"
		isLoading={requestLoading}
	/>
	<LightSuggestionList suggestions={TranscriptRequestSuggestions} {setMaterialSuggestion} />
	<div class="">
		{#if setCommand(firstWord) === 'Translate'}
			{#if genResponse.output_text || genResponse.length > 0}
				<SaveTranslationItem
					input_text={genResponse.input_text}
					input_lang={genResponse.input_lang}
					output_text={genResponse.output_text}
					output_lang={genResponse.output_lang}
					{saveTranslation}
				/>
			{/if}
		{:else}
			<NestedObject data={genResponse} {saveContent} command={setCommand(firstWord)} />
		{/if}
	</div>
</div>

<style>
	.input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}
</style>
