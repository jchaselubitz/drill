<script lang="ts">
	export let label: string;
	export let name: string;
	export let value: string;
 export let placeholder: string;
</script>

<div class="flex flex-col">
	<label class="text-gray-700 text-sm font-bold mb-2" for={name}>{label}</label>
	<input bind:value={value} {name} {placeholder}/>
</div>
