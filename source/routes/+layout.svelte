<script lang='ts'>
	import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
</script>

<svelte:window on:beforeunload={function () {
	sessionStorage.clear();

	return;
}} />

<slot />

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		font-family: "Pretendard JP Variable", "Pretendard JP", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Hiragino Sans", "Apple SD Gothic Neo", Meiryo, "Noto Sans JP", "Noto Sans KR", "Malgun Gothic", Osaka, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
		outline: none;
		user-select: none;
		word-break: keep-all;
		box-sizing: border-box;
	}

	:global(svg) {
		flex-shrink: 0;
	}
</style>