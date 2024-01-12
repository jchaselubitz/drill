<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { Database, Tables } from '$src/types/database.types';
	import type { Card } from '$src/types/primaryTypes';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient<any, 'public', any>;
	export let cards: Card[];
	const labelClass = 'text-sm md:text-base font-bold text-gray-500 whitespace-nowrap';
	const rowInputClass = 'w-64 md:w-full';

	async function updateCard(cardId: number, side_1: string | null, side_2: string | null) {
		const { data, error } = await supabase
			.from('cards')
			.update({
				side_1,
				side_2
			})
			.eq('id', cardId);

		if (error) {
			throw Error(`${'Failed to update card status:'} ${error.message}`);
		}
		invalidate('app:cardUpdate');
	}

	const lastInterval = (card: Card) => {
		return card.intervals_min ? card.intervals_min[card.intervals_min?.length - 1] : '-';
	};

	const nextRepetition = (card: Card) => {
		return card.repetition_history
			? card.repetition_history[card.repetition_history?.length - 1]
			: '-';
	};
</script>

<div class="flex md:w-full overflow-x-auto">
	<table class="md:w-full">
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
				<tr class="text-center">
					<!-- <td>{card.id}</td> -->
					<td
						><input
							class={rowInputClass}
							value={card.side_1}
							on:blur={(event) => {
								//@ts-ignore
								const side_1 = event.target.value;
								updateCard(card.id, side_1, card.side_2);
							}}
						/></td
					>
					<td
						><input
							class={rowInputClass}
							value={card.side_2}
							on:blur={(event) => {
								//@ts-ignore
								const side_2 = event.target.value;
								updateCard(card.id, card.side_1, side_2);
							}}
						/></td
					>
					<td>{lastInterval(card)} </td>
					<td>{nextRepetition(card)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
