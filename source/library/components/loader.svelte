<script lang='ts'>
	import { onMount } from 'svelte';
	import AnticlockwiseDownwardsAndUpwardsOpenCircleArrows from '$lib/assets/anticlockwiseDownwardsAndUpwardsOpenCircleArrows.svg?component';

	const { onvisible }: {
		onvisible: () => void;
	} = $props();

	let hasCalled: boolean = false;
	let element: HTMLLIElement = $state<HTMLLIElement>() as HTMLLIElement;

	onMount(function (): () => void {
		const observer: IntersectionObserver = new IntersectionObserver(function (): void {
			if(!hasCalled) {
				hasCalled = true;
			} else {
				onvisible();
			}

			return;
		});

		observer.observe(element);

		return function (): void {
			observer.unobserve(element);
			
			return;
		};
	});
</script>

<li bind:this={element}><AnticlockwiseDownwardsAndUpwardsOpenCircleArrows height=80 /></li>

<style>
	li {
    max-width: 1000px;
    width: 100%;
		height: 120px;
    border-radius: 20px;
    background-color: #95a2af;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	@media (max-width: 612.77px) {
		li {
			height: 280px !important;
		}
	}

	:global {
		li > svg {
			animation: rotate 1s linear infinite;
		}
	}
</style>