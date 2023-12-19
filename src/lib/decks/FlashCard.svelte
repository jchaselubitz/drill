<script lang="ts">
	let isSide1 = true;
	export let card: {
		id: string;
		side1: string;
		side2: string;
	};

	function toggleSide() {
		isSide1 = !isSide1;
	}
</script>

<div class="card" on:click={toggleSide}>
	{#if isSide1}
		<div class="side1">
			<p>{card.side1}</p>
		</div>
	{:else}
		<div class="side2">
			<p>{card.side2}</p>
		</div>
	{/if}
</div>

<style>
	.card {
		width: 200px;
		height: 200px;
		border: 1px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.side1 {
		background-color: lightblue;
	}

	.side2 {
		background-color: lightgreen;
	}
</style>
