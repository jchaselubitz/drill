<script lang="ts">
	import NestedObject from './NestedObject.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import {
		MOCK_ARBITRARY_RESPONSE,
		getModelSelection,
		type gptFormatType
	} from '$src/utils/helpersAI';
	import type { DestinationTable } from '$src/utils/helpersDB';
	import LoadingButton from '$lib/buttons/LoadingButton.svelte';
	import type { ArbitraryObject } from './types';
	import LightSuggestionList from '$lib/lesson/LightSuggestionList.svelte';
	import { TranscriptRequestSuggestions } from '$src/utils/lists';

	export let transcript: string | null = '';
	export let supabase: SupabaseClient;
	export let source: string;
	$: genResponse = [] as ArbitraryObject;
	$: requestLoading = false;

	// let genResponse: any = JSON.parse(MOCK_ARBITRARY_RESPONSE);

	let requestText = '';

	async function handleRequest() {
		requestLoading = true;
		const modelParams = {
			format: 'json_object' as gptFormatType,
			max_tokens: 1000,
			temperature: 0.9
		};
		const messages = [
			{
				role: 'system',
				content:
					'the user will send you a transcript and a request for how to handle that content. Return as a JSON where possible'
			},

			{ role: 'user', content: `request: ${requestText}` },
			{ role: 'user', content: `transcript: ${transcript}` }
		];

		const { data } = await supabase.functions.invoke('gen-text', {
			body: {
				modelSelection: getModelSelection(),
				modelParams: modelParams,
				messages: messages
			}
		});

		genResponse = JSON.parse(data);
		requestLoading = false;
	}

	async function saveContent(dest_table: DestinationTable, content: string): Promise<boolean> {
		const { error } = await supabase.from(dest_table).insert([
			{
				source,
				text: content,
				lang: 'de'
			}
		]);
		if (error) {
			throw Error(`Error saving content: ${error}`);
		}
		return true;
	}

	function setMaterialSuggestion(suggestion: string) {
		requestText = suggestion;
	}
</script>

<div class="flex flex-col">
	<textarea class="input" bind:value={requestText} />
	<LoadingButton
		class="bg-blue-600 rounded-lg text-white p-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
		onClick={handleRequest}
		text="Request"
		loadingText="Requesting"
		isLoading={requestLoading}
	/>
	<LightSuggestionList suggestions={TranscriptRequestSuggestions} {setMaterialSuggestion} />
	<div class="">
		<NestedObject data={genResponse} {saveContent} />
	</div>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}
</style>
