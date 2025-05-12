<script lang='ts'>
	import Exam from '$lib/components/exam.svelte';
	import type { Exam as ExamType } from '$lib/type';
	import Logo from '$lib/assets/logo.svg?component';
	import Footer from '$lib/components/footer.svelte';
	import Loader from '$lib/components/loader.svelte';
	import { fade } from 'svelte/transition';
	import Preview from '$lib/components/preview.svelte';
	import { loadImage } from '$lib/utility';

	let { data = $bindable() }: {
		data: {
			query: string;
			exams: ExamType[];
		};
	} = $props();

	let index: number = $state(data['exams']['length'] === 50 ? 1 : -1);
	let previewUrl: string | undefined = $state<string>();
</script>

<svelte:window onkeydown={function (event: KeyboardEvent): void {
	if(event['keyCode'] === 27) {
		previewUrl = undefined;
	}
	
	return;
}} />
<nav>
	<a href="/"><Logo height=40 /></a>
</nav>
<main>
	{#if previewUrl !== undefined}
		<button class='overlay' transition:fade onclick={function (): void {
			previewUrl = undefined;
			
			return;
		}}>
			{#await loadImage(previewUrl as string) then}
				<Preview source={previewUrl} class='preview-big' />
			{/await}
		</button>
	{/if}
	<ul>
		{#each data['exams'] as exam, _index}
			<li>
				<Exam exam={exam} bind:previewUrl={previewUrl} />
			</li>

			{#if index !== -1 && _index === data['exams']['length'] - 1}
				<Loader onvisible={function (): void {
					fetch('/api/exams?' + data['query'] + '&page[index]=' + index++)
					.then(function (response: Response): Promise<{
						status: 'success',
						data: ExamType[]
					}> {
						if(response['status'] === 200) {
							return response.json();
						} else {
							throw response;
						}
					})
					.then(function (responseJson: {
						status: 'success',
						data: ExamType[]
					}): void {
						if(responseJson['data']['length'] !== 0) {
							data = {
								query: data['query'],
								exams: data['exams'].concat(responseJson['data'])
							};
						} else {
							index = -1;
						}
		
						return;
					})
					.catch(function (error: unknown): void {
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
	button.overlay {
		border: 0;
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: #5c5c5c6e;
		z-index: 1;
		display: grid;
		place-items: center;
	}

	:global {
		button.preview-big {
			cursor: zoom-out;
		}

		button.preview-big > img {
			max-width: calc(100vw - 32px);
			max-height: calc(100vh - 64px);
			pointer-events: none;
		}
	}


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