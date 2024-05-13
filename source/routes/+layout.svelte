<script lang='ts'>
	import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
</script>

<svelte:window on:beforeunload={function () {
	sessionStorage.clear();

	return;
}} />

<svelte:head>
	{@html '<script defer src=\'https://static.cloudflareinsights.com/beacon.min.js\' data-cf-beacon=\'{"token": "38c6f17baf9048be87e5d48ecbae00f4"}\'></script>'}
</svelte:head>

<slot />

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		font-family: 'Pretendard JP Variable', 'Pretendard JP', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Hiragino Sans', 'Apple SD Gothic Neo', Meiryo, 'Noto Sans JP', 'Noto Sans KR', 'Malgun Gothic', Osaka, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
		outline: none;
		user-select: none;
		word-break: keep-all;
		box-sizing: border-box;
	}

	:global(svg) {
		flex-shrink: 0;
	}
</style>