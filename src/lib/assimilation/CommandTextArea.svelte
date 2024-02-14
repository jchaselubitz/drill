<script lang="ts">
	export let requestText = '';
	export let firstWordIsCommand = false;

	let container;

	$: firstWord = '';
	$: restOfText = '';

	$: if (firstWordIsCommand) {
		const match = requestText.match(/^(\w+)([\s\S]*)$/);
		firstWord = match ? match[1] : '';
		restOfText = match ? match[2] : '';
	} else {
		firstWord = '';
		restOfText = requestText;
	}

	function syncScroll() {
		// Sync the scroll position of the container with the textarea
		container.scrollTop = document.querySelector('.input').scrollTop;
	}

	let isFocused = false;

	function handleFocus() {
		isFocused = true;
	}

	function handleBlur() {
		isFocused = false;
	}
</script>

<div class=" bg-white rounded-md border border-gray-600">
	<div class="relative h-28">
		<div
			class="z-1 absolute top-0 left-0 w-full h-full p-3 overflow-auto whitespace-pre-wrap break-words"
			bind:this={container}
		>
			<span class="styled-first-word">{firstWord}</span>{restOfText}
			<span class="cursor" />
		</div>
		<textarea
			class="input z-2 absolute top-0 left-0 w-full h-full p-3 opacity-0 resize-none"
			bind:value={requestText}
			on:scroll={() => syncScroll()}
			on:focus={handleFocus}
			on:blur={handleBlur}
		/>
	</div>
</div>

<style>
	.cursor {
		display: inline-block;
		margin-left: -1px; /* Adjust as needed */
		height: 1em; /* Match line height */
		width: 2px;
		background-color: black;
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% {
			background-color: transparent;
		}
	}
	.styled-first-word {
		font-weight: bold;
		color: blue;
		background-color: lightgrey;
		padding: 0 0.5rem;
	}
	.styled-text {
		z-index: 1;
		/* The rest of your styles for the styled text container */
	}
	.input {
		z-index: 2;
		/* Make sure padding and other styles match the .styled-text */
		/* You can add "opacity-0" to make the textarea invisible */
	}
</style>
