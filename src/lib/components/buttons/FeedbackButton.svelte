<script>
	import cn from 'classnames';
	export let updateCard = () => {};
	export let buttonColor = 'red';
	export let text = 'BAD';

	let buttonClasses = cn(
		'p-4',
		'flex-grow',
		`bg-${buttonColor}-600`,
		'text-gray-100',
		'font-bold',
		'rounded-lg'
	);
</script>

<button on:click={updateCard} class={buttonClasses}>{text}</button>
