<script lang="ts">
	export let text = '';
	export let path = '';
</script>

<a href={path}
	><div
		class=" bg-gray-200 hover:bg-gray-400 p-2 w-full text-gray-800 text-xs font-semibold uppercase text-center rounded-lg"
	>
		{text}
	</div></a
>
