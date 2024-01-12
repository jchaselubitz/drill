<script lang="ts">
	import cn from 'classnames';
	export let label: string;
	export let name: string;
	export let value: string;
	export let placeholder: string | undefined = undefined;
	export let className: string;
</script>

<div class={cn(className, 'flex flex-col')}>
	<label class="text-gray-700 text-sm font-bold mb-2" for={name}>{label}</label>
	<select bind:value {name}>
		{#if placeholder}
			<option disabled selected>{placeholder}</option>
		{/if}
		<slot />
	</select>
</div>
