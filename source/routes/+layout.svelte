<script lang='ts'>
	import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
	import { partytownSnippet } from '@builder.io/partytown/integration';
</script>

<svelte:window on:beforeunload={function () {
	sessionStorage.clear();

	return;
}} />

<svelte:head>
  {@html '<script>window[\'partytown\']={forward:[\'dataLayer.push\',\'gtag\']};' + partytownSnippet() + '</script>'}
	{@html '<script async type=\'text/partytown\' src=\'https://www.googletagmanager.com/gtag/js?id=G-WZQZBE6Z4T\'>window[\'dataLayer\']=[\'js\',new Date(),\'config\',\'G-WZQZBE6Z4T\'];</script>'}
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