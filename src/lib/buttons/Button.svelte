<script lang="ts">
	import cn from 'classnames';
	export let className: string | undefined = undefined;
	export let onClick = () => {}; // Default no-op function
</script>

<button
	class={cn(
		className
			? className
			: 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white border-none rounded-md px-2 py-1 cursor-pointer '
	)}
	on:click|stopPropagation={onClick}
	{...$$restProps}
>
	<slot />
</button>
