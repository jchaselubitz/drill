<script lang="ts">
	export let text = '';
	export let path = '';
</script>

<div
	class="my-2 bg-gray-200 hover:bg-gray-400 p-2 w-full text-gray-800 text-xs font-semibold uppercase text-center rounded-lg"
>
	<a href={path}>{text}</a>
</div>
