<script lang='ts'>
	import type { Snippet } from 'svelte';

	let {
		flag = $bindable(),
		unit,
		group,
		children
	}: {
		flag: number;
		unit: number;
		group: string;
		children: Snippet;
	} = $props();

	const id: string = group + unit;
	const isChecked: boolean = $derived((flag & unit) !== 0);
</script>

<input type='checkbox' id={id} checked={isChecked} onchange={function (): void {
	if(isChecked) {
		flag &= flag ^ unit;
	} else {
		flag |= unit;
	}

	return;
}}>
<label for={id}>
	{@render children()}
</label>

<style>
	
	@media (max-width: 425px) {
		label {
			font-size: 17px !important;
		}

		:global {
			label > svg {
				height: 17px !important;
			}
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