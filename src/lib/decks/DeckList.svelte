<script lang="ts">
	export let cards: Card[];
	const labelClass = 'text-sm md:text-base font-bold text-gray-500 whitespace-nowrap';

	const lastInterval = (card: Card) => {
		return card.intervals_min ? card.intervals_min[card.intervals_min?.length - 1] : '-';
	};

	const nextRepetition = (card: Card) => {
		return card.repetition_history
			? card.repetition_history[card.repetition_history?.length - 1]
			: '-';
	};
</script>

<div class="flex overflow-x-auto">
	<table>
		<thead>
			<tr>
				<!-- <th>Id</th> -->
				<th class={labelClass}>Side 1</th>
				<th class={labelClass}>Side 2</th>
				<th class={labelClass}>Last interval</th>
				<th class={labelClass}>Next repetition</th>
			</tr>
		</thead>
		<tbody>
			{#each cards as card}
				<tr>
					<!-- <td>{card.id}</td> -->
					<td><input value={card.side_1} /></td>
					<td><input value={card.side_2} /></td>
					<td>{lastInterval(card)} </td>
					<td>{nextRepetition(card)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
