<script lang='ts'>
	import { onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/motion';
	import type { Writable } from 'svelte/store';

	export let flag: Writable<number>;
	export let unit: number;
	export let group: string;

	const id: string = group + unit;

	let input!: HTMLInputElement;

	onMount(function (): Unsubscriber {
		return flag.subscribe(function (flag: number): void {
			input['checked'] = (flag & unit) !== 0;

			return;
		});
	});
</script>

<input type='checkbox' id={id} bind:this={input} on:change={function () {
	if(($flag & unit) !== 0) {
		$flag &= $flag ^ unit;
	} else {
		$flag |= unit;
	}

	return;
}}>
<label for={id}>
	<slot />
</label>

<style>
	
	@media (max-width: 425px) {
		label {
			font-size: 17px !important;
		}

		:global(label > svg) {
			height: 17px !important;
		}
	}

	input {
		display: none;
	}

	label {
		cursor: pointer;
		background-color: #f4f2ec;
		display: grid;
		place-items: center;
		padding: 2px 10px;
		border-radius: 20px;
		user-select: none;
		font-size: 18px;
	}

	label:hover {
		background-color: #eeece6;
	}

	input:checked + label {
		background-color: #175a70;
		color: #ffffff;
	}
</style>