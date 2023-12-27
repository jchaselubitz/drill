<script lang="ts">
	import cn from 'classnames';
	export let updateCard = () => {};
	export let buttonColor = 'red';
	export let text = 'BAD';

	//Need to do this dumb switch statement because tailwind doesn't support dynamic classes
	function setColor(buttonColor: string) {
		switch (buttonColor) {
			case 'blue':
				return 'bg-blue-600';

			case 'green':
				return 'bg-green-600';

			case 'yellow':
				return 'bg-yellow-600';

			case 'red':
				return 'bg-red-600';
		}
	}

	let buttonClasses = cn(
		'p-4',
		'flex-grow',
		`${setColor(buttonColor)}`,
		'text-gray-100',
		'font-bold',
		'rounded-lg'
	);
</script>

<button on:click={updateCard} class={buttonClasses}>{text}</button>
