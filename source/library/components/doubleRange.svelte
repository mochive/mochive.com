<script lang='ts'>
	import { onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/motion';
	import { type Writable } from 'svelte/store';

	export let start: Writable<number>;
	export let end: Writable<number>;
	export let minimum: number;
	export let maximum: number;

	const range: number = maximum - minimum;

	let fill!: HTMLDivElement;

	function updateFill(start: number, end: number): void {
		fill['style']['width'] = 'calc(' + (Number(end) - Number(start)) / range * 100 + '% - 2px)';
		fill['style']['left'] = 'calc(' + ((Number(start) - minimum) / range) * 100 + '% + 1px)';

		return;
	}

	onMount(function (): () => void {
		const unsubscribeStart: Unsubscriber = start.subscribe(function (start: number): void {
			if($start >= minimum) {
				if(start > $end) {
					$end = start;
				}
				
				updateFill(start, $end);
			} else {
				//updateFill(minimum, $end);
				$start = minimum;
			}

			return;
		});

		const unsubscribeEnd: Unsubscriber = end.subscribe(function (end: number): void {
			if($end <= maximum) {
				if(end < $start) {
					$start = end;
				}
	
				updateFill($start, end);
			} else {
				//updateFill($start, maximum);
				$end = maximum;
			}

			return;
		});

		return function (): void {
			unsubscribeStart();
			unsubscribeEnd();

			return;
		};
	});
</script>

<div>
	<div class='fill' bind:this={fill}></div>
	<input type='range' min={minimum} max={maximum} bind:value={$start}>
	<input type='range' min={minimum} max={maximum} bind:value={$end}>
	<div class='background'></div>
</div>

<style>
	div {
		position: relative;
		height: 20px;
		width: 100%;
		border: 0;
	}

	input {
		appearance: none;
		width: 100%;
		margin: 0;
		border: none;
		background: none;
		pointer-events: none;
		position: absolute;
	}

	input:last-child {
		background: none;
	}

	input::-webkit-slider-thumb {
		height: 20px;
		width: 20px;
		border-radius: 100%;
		background-color: #124658;
		cursor: pointer;
		appearance: none;
		pointer-events: all;
	}

	input::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 100%;
		background-color: #124658;
		cursor: pointer;
		appearance: none;
		pointer-events: all;
	}

	input::-ms-thumb {
		height: 20px;
		width: 20px;
		border-radius: 100%;
		background-color: #124658;
		cursor: pointer;
		appearance: none;
		pointer-events: all;
	}
	
	div:hover > input::-webkit-slider-thumb {
		background-color: #18566E;
	}

	div:hover > input::-moz-range-thumb {
		background-color: #18566E;
	}

	div:hover > input::-ms-thumb {
		background-color: #18566E;
	}

	div:active > input::-webkit-slider-thumb {
		background-color: #103D4D;
	}

	div:active > input::-moz-range-thumb {
		background-color: #103D4D;
	}
	
	div:active > input::-ms-thumb {
		background-color: #103D4D;
	}
	
	div.fill {
		height: 8px;
		background-color: #124658;
		position: absolute;
		top: 6px;
		pointer-events: none;
	}
	
	div:hover > div.fill {
		background-color: #18566E;
	}

	div:active > div.fill {
		background-color: #103D4D;
	}
	
	div.background {
		z-index: -1;
		height: 8px;
		width: calc(100% - 2px);
		top: 5px;
		border-radius: 16px;
		background-color: #EFEFEF;
		border: 1px solid #B2B2B2;
		position: absolute;
	}

	@media (width <= 550px) {
		div {
			height: 17px;
		}

		input::-webkit-slider-thumb {
			width: 17px;
			height: 17px;
		}

		input::-moz-range-thumb {
			width: 17px;
			height: 17px;
		}

		input::-ms-thumb {
			width: 17px;
			height: 17px;
		}

		div.fill {
			
		top: 5.5px;
			height: 7px;
		}
		
		div.background {
			height: 7px;
		}
	}
</style>