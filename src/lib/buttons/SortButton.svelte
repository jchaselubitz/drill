<script lang="ts">
	export let asce = true;
</script>

<button class="text-white px-2 p-1 bg-slate-700 text-xs rounded-md" on:click={() => (asce = !asce)}>
	<slot />
</button>
