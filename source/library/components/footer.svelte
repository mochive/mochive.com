<script lang='ts'>
	import HeavyBlackHeart from '$lib/assets/heavyBlackHeart.svg?component';
</script>

<footer>
	<p>Made with <HeavyBlackHeart height=16 />  by <a href='https://github.com/H2Owater425'>H2Owater425</a></p>
	<p><a href='/report'>Report</a>·<a href='https://github.com/mochive'>Github</a>·<a href='mailto:support@mochive.com'>Email</a></p>
</footer>

<style>
	a, a:active, a:visited {
    text-decoration: none;
    color: #01659b;
    font-weight: 500;
	}

	footer {
		background-color: #e1e2e6;
		height: 80px;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8px;
	}

	p {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	p:last-child {
		gap: 8px;
	}
</style>