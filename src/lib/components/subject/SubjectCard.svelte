<script lang="ts">
	import cn from 'classnames';
	export let subject: {
		id: string;
		name: string;
		currentLevel: string;
		lessons: { id: string; name: string; description: string }[];
	};
</script>

<a href={`${subject.id}`}>
	<div role="button" tabindex="0" class={cn('flex flex-col rounded-lg p-2', 'bg-gray-100')}>
		<div class="text-gray-700 text-sm font-bold mb-2">{subject.name}</div>
		<div class="text-gray-700 text-sm mb-2">{subject.currentLevel}</div>
	</div>
</a>
