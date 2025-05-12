<script lang='ts'>
	import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
	import '$lib/assets/global.css';
	import type { Snippet } from 'svelte';

	let { children }: {
		children: Snippet
	} = $props();
</script>

<svelte:window onbeforeunload={function (): void {
	sessionStorage.clear();

	return;
}} />

<svelte:head>
	{@html '<script defer src=\'https://static.cloudflareinsights.com/beacon.min.js\' data-cf-beacon=\'{"token": "38c6f17baf9048be87e5d48ecbae00f4"}\'></script>'}
</svelte:head>

{@render children()}