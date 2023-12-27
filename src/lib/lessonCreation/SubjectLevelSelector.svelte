<script lang="ts">
	import Select from '../inputs/Select.svelte';
	import Input from '../inputs/Input.svelte';

	export let language: string;
	export let level: string;
</script>

<Select label="Language" name="language" bind:value={language} placeholder="language">
	<option value="German">German</option>
	<option value="English">English</option>
	<option value="French">French</option>
	<option value="Spanish">Spanish</option>
</Select>

<Input label="Level" name="level" bind:value={level} placeholder="Level" />
