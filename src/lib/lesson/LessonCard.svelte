<script lang="ts">
	import cn from 'classnames';

	export let lesson: {
		id: string;
		title: string;
		subject_id: string;
		short_description: string;
	};
</script>

<a href={`subjects/${lesson.subject_id}/${lesson.id}`} class="my-2">
	<div
		role="button"
		tabindex="0"
		class={cn(
			'p-4 flex flex-col rounded-lg w-full items-start justify-start',
			' hover:bg-gray-200 hover:shadow-sm focus:bg-slate-300 transition-colors duration-200 ease-in-out',
			'bg-gray-100'
		)}
	>
		<!-- <div class="text-gray-700 text-sm font-bold mb-2">{lesson.subject.name}</div>
		<div class="text-gray-700 text-sm mb-2">{lesson.subject.currentLevel}</div> -->
		<div class="text-gray-700 text-sm font-bold mb-2">{lesson.title}</div>
		<div class="text-gray-700 text-sm mb-2">{lesson.short_description}</div>
	</div>
</a>
