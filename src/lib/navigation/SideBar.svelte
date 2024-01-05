<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
	import type { Session } from '@supabase/supabase-js';
	import ApiKeyForm from './APIKeyForm.svelte';
	import SideBarItem from './SideBarItem.svelte';
	export let session: Session | null;
	export let handleSidebar: (open: boolean) => void;
</script>

<div class="absolute md:relative top-0 bottom-0 bg-gray-300 w-64 border-b-2 p-2">
	<div class="flex justify-end">
		<button on:click={() => handleSidebar(false)}>
			<Icon data={faBars} />
		</button>
	</div>
	<SideBarItem text="My Subjects" path="/" />

	<div class="absolute bottom-4 left-4 right-4"><ApiKeyForm /></div>
</div>
