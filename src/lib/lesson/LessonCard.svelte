<script lang="ts">
	import cn from 'classnames';
	import { fragment, graphql, type Lesson } from '$houdini';
	export let lesson: Lesson;
	$: data = fragment(
		lesson,
		graphql(`
			fragment Lesson on Lesson {
				id
				title
				subject {
					id
					name
					currentLevel
				}
			}
		`)
	);
</script>

<a href={`${lesson.subject.id}/${lesson.id}`} class="my-2">
	<div role="button" tabindex="0" class={cn('flex flex-col rounded-lg p-2', 'bg-gray-100')}>
		<!-- <div class="text-gray-700 text-sm font-bold mb-2">{lesson.subject.name}</div>
		<div class="text-gray-700 text-sm mb-2">{lesson.subject.currentLevel}</div> -->
		<div class="text-gray-700 text-sm mb-2">{lesson.title}</div>
	</div>
</a>
