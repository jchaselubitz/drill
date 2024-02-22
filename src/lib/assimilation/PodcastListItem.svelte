<script lang="ts">
	export let episode;
	export let setEpisodeURL = (url: string) => {};

	const { title, description, imageURL, date, audioURL } = episode;

	function setURL() {
		setEpisodeURL(audioURL);
	}
</script>

<button on:click={setURL} class="text-left">
	<div class="flex rounded-lg border-2 hover:border-gray-500">
		<img class="rounded-md w-16 h-16" src={imageURL} alt={title} />
		<div class="p-2 text-xs">
			<h3>{date}</h3>

			<h3>{title}</h3>
		</div>
	</div>
</button>
