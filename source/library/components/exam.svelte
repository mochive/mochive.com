<script lang='ts'>
	import { BUTTONS, EXAM_RANK_SCORE_KEYS, PAPERS } from '$lib/constant';
	import type { Exam, ExamAsset, ExamRank } from '$lib/type';
	import EjectSymbol from '$lib/assets/ejectSymbol.svg?component';
	import AnticlockwiseDownwardsAndUpwardsOpenCircleArrows from '$lib/assets/anticlockwiseDownwardsAndUpwardsOpenCircleArrows.svg?component';
	import { fade } from 'svelte/transition';
	import Preview from './preview.svelte';
  import type { Component } from 'svelte';
  import type { SVGAttributes } from 'svelte/elements';
	import { loadImage } from '$lib/utility';

	let {
		exam,
		previewUrl: parentPreviewUrl = $bindable()
	}: {
		exam: Exam;
		previewUrl: string | undefined;
	} = $props();

	let data: [ExamRank[], ExamAsset[]] | null | undefined = $state<[ExamRank[], ExamAsset[]] | null | undefined>();
	let details: HTMLDetailsElement = $state<HTMLDetailsElement>() as HTMLDetailsElement;
	let previewUrl: string | undefined = $state<string>();

	const Paper: Component<SVGAttributes<SVGSVGElement>> = $derived(PAPERS[exam['subject'] - 1]);
</script>

<details bind:this={details} transition:fade>
	<summary onclick={function (event: Event): void {
		if(!Array.isArray(data)) {
			event.preventDefault();
			
			data = null;

			Promise.all([fetch('/api/exams/' + exam['id'] + '/ranks'), fetch('/api/exams/' + exam['id'] + '/assets')])
			.then(function (responses: [Response, Response]): Promise<[{
				status: 'success',
				data: ExamRank[]
			}, {
				status: 'success',
				data: ExamAsset[]
			}]> {
				if(responses[0]['status'] === 200 && responses[1]['status'] === 200) {
					return Promise.all([responses[0].json(), responses[1].json()]);
				} else {
					throw responses;
				}
			})
			.then(function (responseJsons: [{
				status: 'success',
				data: ExamRank[]
			}, {
				status: 'success',
				data: ExamAsset[]
			}]): Promise<string> {
				data = [responseJsons[0]['data'], responseJsons[1]['data']];

				return loadImage('https://cdn.mochive.com' + data[1][0]['path'] + '.small.webp');
			})
			.then(function (imageUrl: string): void {
				previewUrl = imageUrl;
				details['open'] = true;
			})
			.catch(console.error);
		}
	
		return;
	}}>
		<Paper class='paper' />
		<section class='title'>
			<h1>{exam['name']}</h1>
			<div class='meta'>
				<time>{exam['takenAt']}</time>
				<div>|</div>
				<p>{exam['questionCount']}문항</p>
				<div>|</div>
				<p>{exam['time']}분</p>
			</div>
		</section>
		<button class='folder'>
			{#if data === undefined || previewUrl !== undefined}
				<EjectSymbol class='status' />
			{:else}
				<AnticlockwiseDownwardsAndUpwardsOpenCircleArrows class='status loading' />
			{/if}
		</button>
	</summary>
	{#if Array.isArray(data)}
		<div class='detail'>
			<section class='preview'>
				<h2>미리보기</h2>
				<Preview source={previewUrl as string} class='preview-small' onclick={function (): void {
					// @ts-expect-error
					parentPreviewUrl = 'https://cdn.mochive.com' + data[1][0]['path'] + '.webp';

					return;
				}}/>
			</section>
			<section>
				<h2>등급컷</h2>
				<table>
					<thead>
						<tr>
							<th>등급</th>
							<th>원점수</th>
							<th>표준점수</th>
							<th>백분위</th>
						</tr>
					</thead>
					<tbody>
						{#if data[0]['length'] !== 0}
							{#each data[0] as rank}
								<tr>
									<td>{rank['grade']}</td>
									{#each EXAM_RANK_SCORE_KEYS as key}
										<td>{rank[key] !== -1 ? rank[key] : '-'}</td>
									{/each}
								</tr>
							{/each}
						{:else}
							{#each { length: 10 } as _}
								<tr>
									<td>-</td>
									<td>-</td>
									<td>-</td>
									<td>-</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</section>
			<section class='download'>
				<h2>다운로드</h2>
				<ul>
					{#each data[1] as asset}
						{@const Icon: Component<SVGAttributes<SVGSVGElement>> = BUTTONS[asset['type'] - 1][0]}
						<li><a href={'https://' + (asset['type'] === 3 && exam['grade'] === 3 && (exam['month'] === 6 || exam['month'] === 9 || exam['month'] === 11) || Number(exam['takenAt'].slice(0, 4)) >= 2024 && (asset['type'] === 2 || asset['type'] === 3) ? 'wdown.ebsi.co.kr/W61001/01exam' : 'cdn.mochive.com') + asset['path']} target='_blank' class='button'><Icon height=45 />{BUTTONS[asset['type'] - 1][1]}</a></li>
					{/each}
					{#each { length: 5 - data[1]['length'] } as _}
						<li></li>
					{/each}
				</ul>
			</section>
		</div>
	{/if}
</details>

<style>
	:global {
		button.preview-small {
			cursor: zoom-in;
			height: 400px;
			width: 282.77px;
		}

		svg {
			flex-shrink: 0;
		}

		svg.status {
			height: 32px;
		}

		details[open] svg.status {
			transform: rotate(180deg);
		}

		svg.loading {
			animation: rotate 1s linear infinite;
		}

		a.button > svg {
			margin-top: 4px;
		}

		svg.paper {
			height: 80px;
			margin-left: 20px;
		}
	}

	details {
		max-width: 1000px;
		width: 100%;
    border-radius: 20px;
		background-color: #eaeaef;
		overflow-y: hidden;
		height: 120px;
		transition: height 480ms ease-in-out;
	}

	details[open] {
		height: 597px;
	}

	h2 {
		font-weight: 600;
		font-size: 24px;
	}

	@media (max-width: 902.77px) {
		details {
			transition: height 600ms ease-in-out;
		}

		section.title {
			margin: 0 10px !important;
			gap: 6px !important;
		}

		h1 {
			font-size: 26px !important;
		}

		h2 {
			font-size: 22px !important;
		}
		
		div.meta {
			font-size: 20px !important;
		}

		details[open] {
			height: 1074px;
		}

		div.detail {
			grid-template-columns: 1.1fr 1fr !important;
			grid-template-rows: 1fr 1fr;
		}

		section.download {
			grid-column: 2 / 3;
		}
		
		:global {
			img.preview-big-image {
				min-height: 600px;
				min-width: 424.16px;
			}
		}
	}
	
	@media (max-width: 612.77px) {
		details {
			transition: height 740ms ease-in-out;
		}

		:global {
			svg.paper {
				height: 75px !important;
			}

			svg.status {
				height: 30px !important;
			}

			svg.paper {
				margin: 0 !important;
				align-self: start;
			}

			img.preview-big-image {
				min-height: 500px;
				min-width: 353.46px;
			}
		}

		button.folder {
			width: 46.875px !important;
			height: 46.875px !important;
		}


		h1 {
			font-size: 25px !important;
		}

		button.folder, section.title {
			margin: 0 !important;
		}
		
		summary {
			display: grid !important;
			padding: 20px;
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr auto;
			flex-direction: column;
			height: 280px !important;
		}

		button.folder {
			align-self: start;
			justify-self: end;
		}
		
		details {
			height: 280px;
		}

		details[open] {
			height: 1702px;
		}

		div.detail {
			grid-template-columns: 1fr !important;
			grid-template-rows: 1fr 1fr 1fr;
		}

		section.download {
			grid-column: auto;
		}
	}

	@media (max-width: 400px) {
		h1 {
			max-height: 90px;
			overflow-y: scroll;
		}

		:global {
			img.preview-big-image {
				min-height: 450px;
				min-width: 318.12px;
			}
		}
	}

	summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #f4f4f8;
		border-radius: 20px;
		height: 120px;
		cursor: pointer;
		list-style: none;
	}

	summary::marker, summary::-webkit-details-marker {
		display: none;
	}

	summary:hover {
		background-color: #efeffa;
	}

	summary:active {
		background-color: #e7e7f1;
	}

	button.folder {
		cursor: pointer;
		border: 0;
		width: 50px;
		height: 50px;
		display: grid;
		place-items: center;
		background-color: #464d56;
		border-radius: 5px;
		flex-shrink: 0;
		margin-right: 35px;
		pointer-events: none;
	}


	h1 {
		font-size: 28px;
		font-weight: 700;
	}

	section.title {
		display: flex;
		flex-direction: column;
		flex-basis: 100%;
		gap: 8px;
		margin: 0 20px;
	}

	section.preview {
		position: unset;
	}

	div.meta {
		display: grid;
		grid-template-columns: auto auto auto auto auto;
		justify-content: start;
		align-items: center;
		font-size: 22px;
		gap: 4px;
		font-weight: 600;
		color: #606060;
	}

	div.detail {
		display: grid;
		grid-template-columns: 1.2fr 1.1fr 1fr;
		justify-items: center;
	}

	div.detail > section {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 18px 0;
	}

	table {
		text-align: center;
		background-color: #5b646e;
		color: #ffffff;
		border-radius: 10px;
		font-size: 16px;
		table-layout: fixed;
		border-spacing: 0;
		width: 250px;
	}
	
	table * {
		font-weight: 300;
	}

	tr {
		height: 36.36px;
	}
	
	ul {
		list-style-type: none;
		height: 400px;
		display: grid;
		grid-template-rows: 1fr 1fr 1fr;
		grid-template-columns: 1fr 1fr;
		place-items: center;
		width: 230px;
	}

	li {
		border-radius: 10px;
		display: grid;
		place-items: center;
		background-color: #5b646e;
		width: 90px;
		height: 90px;
	}

	a.button {
		display: grid;
		place-items: center;
		border-radius: 10px;
		background-color: #464d56;
		width: 90px;
		height: 90px;
		text-decoration: none;
		color: #ffffff;
		font-weight: 500;
		font-size: 20px;
	}

	a.button:hover {
		background-color: #535a64;
	}

	a.button:active {
		background-color: #464d56;
	}
</style>
