<script lang="ts">
	import { faPodcast } from '@fortawesome/free-solid-svg-icons';
	import Icon from 'svelte-awesome';

	import Button from '$lib/buttons/Button.svelte';
	import Input from '$lib/inputs/Input.svelte';
	import PodcastListItem from '$lib/assimilation/PodcastListItem.svelte';
	export let importPodcast = async (url: string) => {};

	let modalRef: HTMLDivElement;

	let isOpen = false;
	let inputValue = '';
	let episodes = [];

	function openModal() {
		isOpen = true;
		setTimeout(() => {
			window.addEventListener('click', handleClickOutside);
		}, 0);
	}

	function closeModal() {
		window.removeEventListener('click', handleClickOutside);
		isOpen = false;
	}

	function triggerFileInput() {
		importPodcast(inputValue);
		closeModal();
	}

	function loadPodcastList() {
		fetch(`/api/podcasts?url=${inputValue}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				episodes = data.episodes;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	function setEpisodeURL(url: string) {
		importPodcast(url);
		closeModal();
	}

	function handleClickOutside(event: any) {
		if (modalRef && !modalRef.contains(event.target)) {
			closeModal();
		}
	}
</script>

{#if isOpen}
	<div class="fixed top-0 bottom-0 left-0 right-0 p-3 bg-gray-800 bg-opacity-40 z-20">
		<div
			class="rounded-lg p-4 mt-10 mx-auto bg-white w-96 flex flex-col gap-2"
			bind:this={modalRef}
		>
			<Input name="link" bind:value={inputValue} placeholder="Enter file url" />
			{#if episodes.length > 0}
				<div class="flex flex-col overflow-scroll h-96 gap-2">
					{#each episodes as episode}
						<PodcastListItem {episode} {setEpisodeURL} />
					{/each}
				</div>
			{/if}

			<Button onClick={loadPodcastList}>{'Load'}</Button>
		</div>
	</div>
{:else}
	<button
		class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700"
		on:click={openModal}
	>
		<Icon data={faPodcast} />
	</button>
{/if}
