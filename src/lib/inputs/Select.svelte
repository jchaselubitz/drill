<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import cn from 'classnames';
	const dispatch = createEventDispatcher();

	export let label: string | undefined = undefined;
	export let name: string;
	export let value: string;
	export let placeholder: string | undefined = undefined;
	export let className: string;

	function handleChange(event: Event) {
		dispatch('change', event);
	}
</script>

<div class={cn(className, 'flex flex-col')}>
	{#if label} <label class="text-gray-700 text-sm font-bold mb-2" for={name}>{label}</label> {/if}
	<select bind:value {name} on:change={handleChange}>
		{#if placeholder}
			<option disabled selected>{placeholder}</option>
		{/if}
		<slot />
	</select>
</div>
