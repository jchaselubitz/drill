<script lang="ts">
	import cn from 'classnames';
	export let href = '';
	export let classes = '';
</script>

<div class={cn(classes, 'hover:cursor-pointer')}>
	<a {href}>
		<slot />
	</a>
</div>
