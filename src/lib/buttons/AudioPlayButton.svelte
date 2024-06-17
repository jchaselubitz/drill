<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faPlay, faPause, faDownLong } from '@fortawesome/free-solid-svg-icons';
	import cn from 'classnames';

	let loadingImage = '/images/loading-circle.png';
	export let exists: boolean | undefined = false;
	export let isLoading: boolean | undefined = false;
	export let isPlaying: boolean;
	export let handleClick: () => void;
</script>

<button
	class={cn(
		[
			'flex items-center justify-center gap-2 h-10 w-10 transition-colors duration-150 border-2 rounded-full hover:text-white focus:outline-none focus:shadow-outline-blue'
		],
		[
			!exists
				? 'border-gray-800 text-gray-800 active:bg-gray-800 hover:bg-gray-900'
				: 'border-blue-600 text-blue-600 active:bg-blue-600 hover:bg-blue-700'
		]
	)}
	on:click|stopPropagation={handleClick}
	disabled={isLoading}
>
	{#if isLoading}
		<span> <img src={loadingImage} alt="loading" class=" h-8 w-8 animate-spin" /></span>
	{:else if isPlaying}
		<Icon data={faPause} />
	{:else if exists}
		<Icon data={faPlay} />
	{:else}
		<Icon data={faDownLong} />
	{/if}
</button>
