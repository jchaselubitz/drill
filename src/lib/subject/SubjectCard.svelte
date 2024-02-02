<script lang="ts">
	import cn from 'classnames';
	export let subject: {
		id: string;
		name: string;
		current_level: string;
		lessons: { id: string; name: string; description: string }[];
	};
</script>

<a href={`subjects/${subject.id}`}>
	<div
		role="button"
		tabindex="0"
		class={cn(
			'p-4 flex flex-col rounded-lg w-full items-start justify-start',
			' hover:bg-gray-200 hover:shadow-sm focus:bg-slate-300 transition-colors duration-200 ease-in-out',
			'bg-gray-100'
		)}
	>
		<div class="text-gray-700 text-sm font-bold mb-2">{subject.name}</div>
		<div class="text-gray-700 text-sm mb-2">{subject.current_level}</div>
	</div>
</a>
