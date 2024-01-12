<script lang="ts">
	export let text = '';
	export let path = '';
	export let isMobile = false;
	export let toggleSidebar: (open: boolean) => void;
</script>

<a href={path}
	><button
		class=" bg-gray-200 hover:bg-gray-400 p-2 w-full text-gray-800 text-xs font-semibold uppercase text-center rounded-lg"
		on:click={() => {
			isMobile && toggleSidebar(false);
		}}
		type="button"
	>
		{text}
	</button></a
>
