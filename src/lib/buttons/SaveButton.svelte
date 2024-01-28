<script lang="ts">
	import Button from './Button.svelte';
	export let onClick = () => {}; // Default no-op function
</script>

<Button {...$$restProps} {onClick}>
	<slot />
</Button>
