<script lang="ts">
	import cn from 'classnames';
	import type { Option } from './types';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import LessonOptionDetails from './LessonOptionDetails.svelte';
	import type { LanguagesISO639 } from '$src/utils/lists';

	export let option: Option;
	export let userLanguage: LanguagesISO639;
	export let studyLanguage: LanguagesISO639;
	export let currentLevel: string;
	export let supabase: SupabaseClient<any, 'public', any>;
	export let userId: string | undefined;
	export let subjectId: string | null;
	let isLoading = false;
	$: console.log(subjectId);

	$: isOpen = false;

	const handleSelected = () => {
		isOpen = !isOpen;
	};

	const handleKeyDown = (event: KeyboardEvent, option: Option) => {
		if (event.key === ' ') {
			handleSelected();
		}
	};
</script>

<div
	class={cn(
		'flex rounded-lg w-full items-center justify-start',
		' hover:bg-gray-200 hover:shadow-sm focus:bg-slate-300 transition-colors duration-200 ease-in-out',
		'bg-gray-100'
	)}
>
	<div class="flex flex-col gap-3 w-full pb-4">
		<button
			disabled={isLoading}
			type="submit"
			class="flex px-4 pt-4 w-full items-start"
			tabindex="0"
			on:click={() => handleSelected()}
			on:keydown={(e) => handleKeyDown(e, option)}
		>
			<div class="col-span-11 flex flex-col items-start">
				<div class="text-gray-700 text-sm font-bold mb-2 text-left">{option.title}</div>
				<div class="text-gray-700 text-sm text-left">{option.description}</div>
			</div>
		</button>

		{#if isOpen}
			<LessonOptionDetails
				{option}
				{userId}
				{subjectId}
				{studyLanguage}
				{userLanguage}
				{currentLevel}
				{supabase}
			/>
		{/if}
	</div>
</div>
