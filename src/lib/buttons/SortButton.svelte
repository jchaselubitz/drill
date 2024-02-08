<script lang="ts">
	export let asce = true;
</script>

<button class="text-white px-3 p-1 bg-slate-700 text-sm rounded-md" on:click={() => (asce = !asce)}>
	<slot />
</button>
