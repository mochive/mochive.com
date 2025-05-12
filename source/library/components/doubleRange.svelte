<script lang='ts'>
	let {
		start = $bindable(),
		end = $bindable(),
		minimum,
		maximum
	}: {
		start: number;
		end: number;
		minimum: number;
		maximum: number;
	} = $props();

	const range: number = maximum - minimum;
	
	let previousEnd: number = end;
	let fill: HTMLDivElement = $state<HTMLDivElement>() as HTMLDivElement;

	$effect(function (): void {
		if(start < minimum) {
			start = minimum;
		}

		if(end > maximum) {
			end = maximum;
		}

		if(start > end) {
			if(end === previousEnd) {
				end = start;
			} else {
				start = end;
			}
		}

		previousEnd = end;

		fill['style']['width'] = ((end - start) * 100 / range) + '%';
		fill['style']['left'] = (((start - minimum) * 100 / range) + (minimum - start + maximum - end) * 0.1) + '%';
	});
</script>

<div>
	<div class='fill' bind:this={fill}></div>
	<input type='range' min={minimum} max={maximum} bind:value={start}>
	<input type='range' min={minimum} max={maximum} bind:value={end}>
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
		border-radius: 10px;
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