<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Button from '$lib/buttons/Button.svelte';
	import Input from '$lib/inputs/Input.svelte';
	import Select from '$lib/inputs/Select.svelte';
	import { Languages } from '$src/utils/lists';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient;

	let modalRef: HTMLDivElement;

	let isOpen = false;
	let inputValue = '';
	$: lang = 'en';

	function openModal() {
		isOpen = true;
		setTimeout(() => {
			window.addEventListener('click', handleClickOutside);
			return () => {
				window.removeEventListener('click', handleClickOutside);
			};
		}, 0);
	}

	function closeModal() {
		isOpen = false;
	}

	const setLanguage = (event: Event & { detail: Event }) => {
		lang = (event.detail.target as HTMLSelectElement).value;
	};

	async function savePhrase() {
		const { error } = await supabase.from('phrases').insert([
			{
				source: 'manual-input',
				text: inputValue,
				lang: lang
			}
		]);
		if (error) {
			throw Error(`Error saving content: ${error}`);
		}
		invalidate('app:library');
		closeModal();
	}

	function handleClickOutside(event: any) {
		if (modalRef && !modalRef.contains(event.target)) {
			closeModal();
			window.removeEventListener('click', handleClickOutside);
		}
	}
</script>

{#if isOpen}
	<div class="fixed top-0 bottom-0 left-0 right-0 p-3 bg-gray-800 bg-opacity-40">
		<div class="rounded-lg p-4 mt-10 bg-white flex flex-col gap-2" bind:this={modalRef}>
			<Input name="phrase" isTextArea bind:value={inputValue} placeholder="Enter text" />
			<Select name="language" value={lang} className="" on:change={setLanguage}>
				{#each Languages as language}
					<option value={language.value}>{language.name}</option>
				{/each}
			</Select>
			<Button onClick={savePhrase}>Save</Button>
		</div>
	</div>
{:else}
	<button class="text-white px-3 p-1 bg-slate-700 text-sm rounded-md" on:click={openModal}
		>Add Word</button
	>
{/if}
