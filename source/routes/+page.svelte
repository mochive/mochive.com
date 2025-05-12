<script lang='ts'>
	import Checkbox from '$lib/components/checkbox.svelte';
	import DoubleRange from '$lib/components/doubleRange.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Mochive from '$lib/assets/mochive.svg?component';
	import GraduationCap from '$lib/assets/graduationCap.svg?component';
	import ClosedBook from '$lib/assets/closedBook.svg?component';
	import SpiralCalendar from '$lib/assets/spiralCalendar.svg?component';
	import LeftPointingMagnifyingGlass from '$lib/assets/leftPointingMagnifyingGlass.svg?component';
	import { base64Encode } from '$lib/utility';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const minimumYear: number = 2006;
	const maximumYear: number = (new Date()).getFullYear();
	
	let term: string = $state<string>('');
	let gradeFlag: number = $state<number>(0);
	let subjectFlag: number = $state<number>(0);
	let monthFlag: number = $state<number>(0);
	let startYear: number = $state<number>(minimumYear);
	let endYear: number = $state<number>(maximumYear);

	onMount(function (): void {
		const rawTerm: string | null = sessionStorage.getItem('term');
		const rawGradeFlag: string | null = sessionStorage.getItem('gradeFlag');
		const rawSubjectFlag: string | null = sessionStorage.getItem('subjectFlag');
		const rawMonthFlag: string | null = sessionStorage.getItem('monthFlag');
		const rawStartYear: string | null = sessionStorage.getItem('startYear');
		const rawEndYear: string | null = sessionStorage.getItem('endYear');
		
		if(rawTerm !== null) {
			term = rawTerm;
		}

		if(rawGradeFlag !== null) {
			gradeFlag = Number(rawGradeFlag);
		}

		if(rawSubjectFlag !== null) {
			subjectFlag = Number(rawSubjectFlag);
		}

		if(rawMonthFlag !== null) {
			monthFlag = Number(rawMonthFlag);
		}

		if(rawStartYear !== null) {
			startYear = Number(rawStartYear);
		}

		if(rawEndYear !== null) {
			endYear = Number(rawEndYear);
		}

		return;
	});
</script>

<main>
	<h1><Mochive id='logo' /></h1>
	<form action='/search' onsubmit={function (event: SubmitEvent): void {
		event.preventDefault();

		sessionStorage.setItem('term', term);
		sessionStorage.setItem('gradeFlag', String(gradeFlag));
		sessionStorage.setItem('subjectFlag', String(subjectFlag));
		sessionStorage.setItem('monthFlag', String(monthFlag));
		sessionStorage.setItem('startYear', String(startYear));
		sessionStorage.setItem('endYear', String(endYear));

		goto('/search?query=' + base64Encode(gradeFlag + ',' + subjectFlag + ',' + monthFlag + ',' + startYear + ',' + endYear + ',' + term));

		return;
	}}>
		<fieldset id='searchbox'>
			<label><input type='text' bind:value={term}></label>
			<button type="submit" title='submit'><LeftPointingMagnifyingGlass height=24 /></button>
		</fieldset>
	
		<fieldset>
			<Checkbox group='grade' bind:flag={gradeFlag} unit={0b111}><GraduationCap class='icon' /></Checkbox>
			<Checkbox group='grade' bind:flag={gradeFlag} unit={0b001}>1학년</Checkbox>
			<Checkbox group='grade' bind:flag={gradeFlag} unit={0b010}>2학년</Checkbox>
			<Checkbox group='grade' bind:flag={gradeFlag} unit={0b100}>3학년</Checkbox>
		</fieldset>
	
		<fieldset>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b11111111}><ClosedBook class='icon' /></Checkbox>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b00000001}>국어</Checkbox>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b00000010}>수학</Checkbox>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b00000100}>영어</Checkbox>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b00001000}>한국사</Checkbox>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b00010000}>사회탐구</Checkbox>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b00100000}>과학탐구</Checkbox>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b01000000}>직업탐구</Checkbox>
			<Checkbox group='subject' bind:flag={subjectFlag} unit={0b10000000}>제2외국어</Checkbox>
		</fieldset>
	
		<fieldset>
			<Checkbox group='month' bind:flag={monthFlag} unit={0b1111111}><SpiralCalendar class='icon' /></Checkbox>
			<Checkbox group='month' bind:flag={monthFlag} unit={0b0000001}>3월</Checkbox>
			<Checkbox group='month' bind:flag={monthFlag} unit={0b0000010}>4월</Checkbox>
			<Checkbox group='month' bind:flag={monthFlag} unit={0b0000100}>6월</Checkbox>
			<Checkbox group='month' bind:flag={monthFlag} unit={0b0001000}>7월</Checkbox>
			<Checkbox group='month' bind:flag={monthFlag} unit={0b0010000}>9월</Checkbox>
			<Checkbox group='month' bind:flag={monthFlag} unit={0b0100000}>10월</Checkbox>
			<Checkbox group='month' bind:flag={monthFlag} unit={0b1000000}>11월</Checkbox>
		</fieldset>

		<fieldset id='year'>
			<div id='year-inputs'>
				<input type="number" min={minimumYear} max={maximumYear} bind:value={startYear} onchange={function (event) {
					if(event['currentTarget']['valueAsNumber'] >= minimumYear && event['currentTarget']['valueAsNumber'] <= maximumYear) {
						startYear = event['currentTarget']['valueAsNumber'];
					}

					return;
				}}>
				<div></div>
				<input type="number" min={minimumYear} max={maximumYear} bind:value={endYear} onchange={function (event) {
					if(event['currentTarget']['valueAsNumber'] <= maximumYear && event['currentTarget']['valueAsNumber'] >= minimumYear) {
						endYear = event['currentTarget']['valueAsNumber'];
					}

					return;
				}}>
			</div>
			<DoubleRange bind:start={startYear} bind:end={endYear} minimum={minimumYear} maximum={maximumYear} />
		</fieldset>
	</form>
	<a href="https://github.com/mochive/mochive.com/blob/main/RECRUITING.md" id="recruiting">모카이브 팀과 함께하실 분을 모집합니다!</a>
</main>
<Footer />

<style>
	:global {
		svg#logo {
			width: 100%;
			max-width: 320px;
		}

		svg.icon {
			height: 18px;
		}
	}

	#recruiting, #recruiting:visited, #recruiting:active {
		text-decoration: none;
		color: #0ab498;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24px;
		width: 100%;
		height: 100vh;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		width: calc(100% - 16px);
		max-width: 660px;
	}
	
	button {
		border: 0;
		cursor: pointer;
		background-color: #f5f2eb;
		width: 56px;
		border-radius: 0 20px 20px 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	fieldset:not(:first-child,:last-child) {
		flex-wrap: wrap;
		width: 100%;
		justify-content: center;
	}

	#searchbox {
		width: 100%;
		display: flex;
		justify-content: start;
		gap: 0;
		margin-bottom: 16px;
	}

	#searchbox > label {
		cursor: text;
		height: 40px;
		width: 100%;
		border: 0;
		display: flex;
		align-items: center;
		padding-left: 16px;
		background-color: #f5f2eb;
		border-radius: 20px 0 0 20px;
	}

	#searchbox > label > input {
		border: 0;
		font-size: 18px;
		width: 100%;
		background-color: transparent;
	}

	fieldset {
		border: 0;
		display: flex;
		gap: 4px;
	}

	#year {
		display: flex;
		flex-direction: column;
		max-width: 600px;
		width: 90%;
	}

	#year-inputs {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	#year-inputs > div {
		height: 1px;
		background-color: #0e3746;
		width: 16px;

	}

	#year-inputs > input {
		width: 54px;
		font-size: 16px;
		border: 0;
		color: #0e3746;
		text-decoration: underline;
	}

	#year-inputs > input:last-child {
		margin-right: -16px;
	}
</style>