<script lang="ts">
	import { onMount } from 'svelte';

	let formClasses = 'flex flex-col gap-3 text-xs';
	let buttonClasses = 'bg-slate-700 text-xs text-white p-3';

	$: isSavedKey = false;
	$: openApiKey = '';
	$: modelSelection = '';

	onMount(() => {
		openApiKey = localStorage.getItem('OpenAIKey') ?? '';
		if (openApiKey) {
			isSavedKey = true;
		}
		modelSelection = localStorage.getItem('OpenAIModel') ?? 'gpt3';
	});

	const addModelToLocalStorage = () => {
		localStorage.setItem('OpenAIModel', modelSelection);
	};
	const addKeyToLocalStorage = () => {
		localStorage.setItem('OpenAIKey', openApiKey);
		isSavedKey = true;
	};
	const removeKeyFromLocalStorage = () => {
		localStorage.removeItem('OpenAIKey');
		isSavedKey = false;
		openApiKey = '';
	};
</script>

<div class="relative flex flex-col gap-3">
	<form class={formClasses}>
		<select
			class="text-xs"
			name="model"
			bind:value={modelSelection}
			on:change={addModelToLocalStorage}
		>
			<option value="gpt4">GPT-4</option>
			<option value="gpt3">GPT-3</option>
		</select>
	</form>

	{#if isSavedKey}
		<form class={formClasses}>
			<button class={buttonClasses} type="submit" on:click={removeKeyFromLocalStorage}
				>Remove API Key</button
			>
		</form>
	{:else}
		<form class={formClasses}>
			<input class="text-xs" type="text" name="apiKey" bind:value={openApiKey} />
			<button class={buttonClasses} type="submit" on:click={addKeyToLocalStorage}
				>Save API Key</button
			>
		</form>
	{/if}
</div>
