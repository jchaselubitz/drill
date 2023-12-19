<script lang="ts">
	let isSide1 = true;
	export let click = (): void => {};
	export let card: {
		id: string;
		side1: string;
		side2: string;
		cardStatus: string;
	};

	function toggleSide() {
		isSide1 = !isSide1;
	}

	function updateCardStatus(status: string) {
		click();
		isSide1 = true;
	}
</script>

<div class="flex flex-col">
	<div class="card" on:click={toggleSide} on:keydown={toggleSide} role="button" tabindex="0">
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
	{#if !isSide1}
		<div class="status-buttons">
			<button on:click={() => updateCardStatus('BAD')}>BAD</button>
			<button on:click={() => updateCardStatus('HARD')}>HARD</button>
			<button on:click={() => updateCardStatus('GOOD')}>GOOD</button>
			<button on:click={() => updateCardStatus('EASY')}>EASY</button>
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
