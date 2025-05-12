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

<button class={_class} on:click={function () {
	dispatch('click');

	return;
}}>
	{#await new Promise(function (resolve, reject) {
		const image = new Image();

		image['src'] = source;

		image.addEventListener('load', resolve);
		image.addEventListener('error', reject);

		return;
	}) then}
		<img transition:fade src={source} alt={source}>
		<LeftPointingMagnifyingGlass class='preview' height=30 />
	{/await}
</button>

<style>
	button {
		position: relative;
		border: 0;
		background-color: transparent;
		border-radius: 10px;
	}
	
	img {
		border-radius: 10px;
		max-width: 100%;
		max-height: 100%;
	}

	:global(.preview) {
		position: absolute;
		bottom: 9px;
		right: 6px;
	}
</style>