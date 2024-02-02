<script lang="ts">
	import type { Option } from './types';
	import LessonOption from './LessonOption.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { LanguagesISO639 } from '$src/utils/lists';

	export let options: Option[];
	export let userLanguage: LanguagesISO639;
	export let studyLanguage: LanguagesISO639;
	export let currentLevel: string;
	export let supabase: SupabaseClient<any, 'public', any>;
	export let userId: string | undefined;
	export let subjectId: string | null;
</script>

<div class="flex flex-col gap-4 prose">
	{#each options as option}
		<LessonOption
			{option}
			{studyLanguage}
			{userLanguage}
			{currentLevel}
			{userId}
			{subjectId}
			{supabase}
		/>
	{/each}
</div>
