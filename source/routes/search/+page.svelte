<script lang='ts'>
	import Exam from '$lib/components/exam.svelte';
	import type { Exam as ExamType } from '$lib/type';
	import Logo from '$lib/assets/logo.svg?component';
	import Footer from '$lib/components/footer.svelte';
	import Loader from '$lib/components/loader.svelte';

	export let data: {
		query: string;
		exams: ExamType[];
	};

	let index: number = data['exams']['length'] === 50 ? 1 : -1;
</script>

<nav>
	<a href="/"><Logo height=40 /></a>
</nav>
<main>
	<ul>
		{#each data['exams'] as exam, _index}
			<li>
				<Exam exam={exam} />
			</li>

			{#if index !== -1 && _index === data['exams']['length'] - 1}
				<Loader on:visible={function () {
					fetch('/api/exams?' + data['query'] + '&page[index]=' + index++)
					.then(function (response) {
						if(response['status'] === 200) {
							return response.json();
						} else {
							throw response;
						}
					})
					.then(function (responseJson) {
						if(responseJson['data']['length'] !== 0) {
							data['exams'] = data['exams'].concat(responseJson['data']);
						} else {
							index = -1;
						}
		
						return;
					})
					.catch(function (error) {
						index = -1;

						console.error(error);

						return;
					});

					return;
				}} />
			{/if}
		{/each}
	</ul>
</main>
<Footer />

<style>
	@keyframes -global-rotate {
		from {
			transform: rotate(360deg);
		}

		to {
			transform: rotate(0deg);
		}
	}

	main {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-bottom: 8px;
		margin-top: 58px;
		min-height: 100vh;
	}

	nav {
		background-color: #f5f2eb;
		height: 50px;
		position: fixed;
		top: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
	}

	ul {
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 1000px;
	}
</style>