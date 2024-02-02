<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { Translation } from '$src/types/primaryTypes';
	import { getLangName } from '$src/utils/lists';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient<any, 'public', any>;
	export let cards: Translation[];
	const labelClass = 'text-sm md:text-base font-bold text-gray-500 whitespace-nowrap';
	const rowInputClass = 'w-64 md:w-full';

	async function updatePhrase(phraseId: number, text: string | null) {
		const { data, error } = await supabase
			.from('phrases')
			.update({
				text
			})
			.eq('id', phraseId);

		if (error) {
			throw Error(`${'Failed to update phrase:'} ${error.message}`);
		}
		invalidate('app:lesson');
	}

	const lastInterval = (card: Translation) => {
		return card.interval_history ? card.interval_history[card.interval_history?.length - 1] : '-';
	};

	const nextRepetition = (card: Translation) => {
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
				<th class={labelClass}>{getLangName(cards[0].phrase_primary_id.lang)}</th>
				<th class={labelClass}>{getLangName(cards[0].phrase_secondary_id.lang)}</th>
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
							value={card.phrase_primary_id.text}
							on:blur={(event) => {
								//@ts-ignore
								const side_1 = event.target.value;
								updatePhrase(card.phrase_primary_id.id, side_1);
							}}
						/></td
					>
					<td
						><input
							class={rowInputClass}
							value={card.phrase_secondary_id.text}
							on:blur={(event) => {
								//@ts-ignore
								const side_2 = event.target.value;
								updatePhrase(card.phrase_secondary_id.id, side_2);
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
