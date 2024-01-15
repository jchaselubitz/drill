<script lang="ts">
	import type { Option } from './types';
	import LessonOption from './LessonOption.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let options: Option[];
	export let userLanguage: string;
	export let subjectLanguage: string;
	export let currentLevel: string;
	export let supabase: SupabaseClient<any, 'public', any>;
	export let userId: string | undefined;
	export let subjectId: string | null;
</script>

<div class="flex flex-col gap-4 prose">
	{#each options as option}
		<LessonOption
			{option}
			{subjectLanguage}
			{userLanguage}
			{currentLevel}
			{userId}
			{subjectId}
			{supabase}
		/>
	{/each}
</div>
