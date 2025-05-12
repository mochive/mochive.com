<script lang='ts'>
	import LeftPointingMagnifyingGlass from '$lib/assets/leftPointingMagnifyingGlass.svg?component';
	import { fade } from 'svelte/transition';
	
	let {
		source,
		class: _class = '',
		onclick
	}: {
		source: string;
		class?: string;
		onclick?: () => void;
	} = $props();
</script>

<button class={_class} onclick={onclick}>
	<img transition:fade src={source} alt={source}>
	<LeftPointingMagnifyingGlass class='preview' height=30 />
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

	:global {
		.preview {
			position: absolute;
			bottom: 9px;
			right: 6px;
		}
	}
</style>