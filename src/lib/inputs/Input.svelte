<script lang="ts">
	export let label: string;
	export let name: string;
	export let value: string;
	export let isTextArea: boolean = false;
	export let placeholder: string | undefined = undefined;
</script>

<div class="flex flex-col">
	<label class="text-gray-700 text-sm font-bold mb-2" for={name}>{label}</label>
	{#if isTextArea}
		<textarea bind:value {name} {placeholder} />
	{:else}
		<input bind:value {name} {placeholder} />
	{/if}
</div>
