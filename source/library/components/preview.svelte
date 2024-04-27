<script lang='ts'>
	import LeftPointingMagnifyingGlass from '$lib/assets/leftPointingMagnifyingGlass.svg?component';
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	
	export let source: string;
	let _class = '';

	export { _class as class };

	const dispatch: EventDispatcher<{
		'click': unknown;
	}> = createEventDispatcher();
</script>

<button transition:fade class={_class} on:click={function () {
	dispatch('click');

	return;
}}>
	<img src={source} alt={source}>
	<LeftPointingMagnifyingGlass class='preview' height=30 />
</button>

<style>
	button {
		position: relative;
		border: 0;
		background-color: transparent;
	}
	
	img {
		border-radius: 10px;
		width: 100%;
		height: 100%;
	}

	:global(.preview) {
		position: absolute;
		bottom: 9px;
		right: 6px;
	}
</style>