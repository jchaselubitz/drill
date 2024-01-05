<script lang="ts">
	import cn from 'classnames';
	import { enhance } from '$app/forms';
	import Icon from 'svelte-awesome';
	import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faUpRightFromSquare';
	import type { Option } from './types';
	import { getModelSelection } from '$src/utils/generateCards';
	import { onMount } from 'svelte';

	$: openApiKey = '';
	$: modelSelection = '';

	onMount(() => {
		openApiKey = localStorage.getItem('OpenAIKey') ?? '';
		modelSelection = getModelSelection(localStorage);
	});

	export let selectedLessons: Option[] = [];
	export let option: Option;
	export let userLanguage: string;
	export let subjectLanguage: string;
	export let currentLevel: string;
	let isLoading = false;
	let loadingImage = '/images/loading-circle.png';

	$: lessonLink = '';

	const handleSelected = (option: Option) => {
		if (selectedLessons.includes(option)) {
			selectedLessons = selectedLessons.filter((lesson) => lesson !== option);
		} else {
			selectedLessons = [...selectedLessons, option];
		}
	};

	const handleKeyDown = (event: KeyboardEvent, option: Option) => {
		if (event.key === ' ') {
			handleSelected(option);
		}
	};
</script>

<form
	method="POST"
	action="?/genCards"
	use:enhance={() => {
		isLoading = true;
		return async ({ result, update }) => {
			isLoading = false;
			const data = result.data.result;
			lessonLink = `/${data.subject_id}/${data.lesson_id}`;
		};
	}}
>
	<input type="hidden" name="openApiKey" value={openApiKey} />
	<input type="hidden" name="modelSelection" value={modelSelection} />
	<input type="hidden" name="language" value={userLanguage} />
	<input type="hidden" name="currentLevel" value={currentLevel} />
	<input type="hidden" name="subjectLanguage" value={subjectLanguage} />
	<input type="hidden" name="lessonTitle" value={option.title} />
	<input type="hidden" name="lessonDescription" value={option.description} />
	<div
		class={cn(
			'flex rounded-lg px-4 w-full h-20 items-center justify-start',
			' hover:bg-gray-200 hover:shadow-sm focus:bg-slate-300 transition-colors duration-200 ease-in-out',
			'bg-gray-100'
		)}
	>
		<div class="grid grid-cols-12 gap-3 w-full">
			<button
				disabled={isLoading}
				type="submit"
				class="col-span-11 flex flex-col items-start"
				tabindex="0"
				on:click={() => handleSelected(option)}
				on:keydown={(e) => handleKeyDown(e, option)}
			>
				<div class="text-gray-700 text-sm font-bold mb-2">{option.title}</div>
				<div class="text-gray-700 text-sm text-left">{option.description}</div>
			</button>

			<div class="flex col-span-1 items-center">
				{#if isLoading}
					<img src={loadingImage} alt="loading" class="p-0 m-0 animate-spin" />
				{/if}
				{#if lessonLink}
					<a tabindex="0" href={lessonLink}> <Icon data={faUpRightFromSquare} /></a>
				{/if}
			</div>
		</div>
	</div>
</form>
