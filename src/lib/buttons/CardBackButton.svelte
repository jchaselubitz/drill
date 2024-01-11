<script lang="ts">
	export let undo: () => void;
</script>

<button on:click={undo} class="p-2 bg-blue-500 text-white md:rounded-l-md"
	><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
		<path
			fill-rule="evenodd"
			d="M10.707 3.293a1 1 0 010 1.414L6.414 9H16a1 1 0 010 2H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"
			clip-rule="evenodd"
		/>
	</svg></button
>
