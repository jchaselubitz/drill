<script lang="ts">
	export let label: string | undefined = undefined;
	export let name: string;
	export let value: string;
	export let isTextArea: boolean = false;
	export let placeholder: string | undefined = undefined;
</script>

<div class="flex flex-col">
	{#if label}
		<label class="text-gray-700 text-sm font-bold mb-2" for={name}>{label}</label>
	{/if}

	{#if isTextArea}
		<textarea bind:value {name} {placeholder} class="rounded-md h-28" />
	{:else}
		<input bind:value {name} {placeholder} class="rounded-md" />
	{/if}
</div>
