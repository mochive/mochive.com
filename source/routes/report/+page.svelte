<script lang='ts'>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/footer.svelte';
	import { EMAIL_REGULAR_EXPRESSION } from '$lib/constant';

	let turnstile!: HTMLFieldSetElement;
	let email!: HTMLInputElement;
	let content!: HTMLTextAreaElement;

	onMount(function () {
		const script: HTMLScriptElement = document.createElement('script');
		
		script['src'] = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		
		document['head'].appendChild(script);
		
		return;
	});

	const date: Date = new Date();
</script>

<main>
	<section id='paper'>
		<header>
			<h3>{date.getFullYear()}학년도 {date.getMonth() + 1}월 고{Math.trunc(Math.random() * 3) + 1} <a href='/'>모카이브</a> 문제지</h3>
			<h1>신고 영역</h1>
			<section id='information'>
				<h2>제 {Math.trunc(Math.random() * 6) + 1} 교시</h2>
				<h2>1</h2>
			</section>
		</header>
		<form action='/api/reports' method='post' on:submit={function (event) {
			event.preventDefault();
		
			if(content['value']['length'] >= 1 && content['value']['length'] <= 2048) {
				if(EMAIL_REGULAR_EXPRESSION.test(email['value'])) {
					if('cf-turnstile-response' in turnstile['children']) {
						fetch('/api/reports', {
							method: 'POST',
							body: JSON.stringify({
								email: email['value'],
								content: content['value'],
								// @ts-expect-error
								token: turnstile['children']['cf-turnstile-response']['value']
							})
						})
						.then(function () {
							alert('제출 성공');
				
							goto('/');
							
							return;
						})
						.catch(console.error);
					} else {
						alert('Turnstile 오류');
					}
				} else {
					alert('이메일 형식 오류');
				}
			} else {
				alert('내용 형식 오류');
			}

			return;
		}}>
			<label for='email'><b><i>1.</i></b> 다음 글의 답변을 받을 메일로 가장 적절한 것은?</label>
			<textarea placeholder='내용을 작성하시오.' minlength=1 maxlength=2048 required bind:this={content}></textarea>
			<ol>
				<li>① 모카이브를 사용해주셔서 정말 감사드립니다!</li>
				<li>② 이 사이트는 학생 1인 개발이기에 여러 오류가 있을 수 있습니다.</li>
				<li>③ 파일, 등급컷 등의 간단한 오류는 이 페이지를 통해 신고해주시고,</li>
				<li>④ 첨부 파일이 필요한 경우는 <a href='mailto:support@mochive.com'>메일</a>로 신고를 부탁드리겠습니다.</li>
				<li>⑤<span>✓</span><input type='email' id='email' placeholder='메일을 작성하시오.' required bind:this={email}></li>
			</ol>
			<section id='notice'>
				<h4>※ 확인 사항</h4>
				<p>◦ 답안지의 해당란에 필요한 내용을 정확히 기입(표기)했는지 확인하시오.</p>
			</section>
			<fieldset class='cf-turnstile' data-sitekey='0x4AAAAAAAY39e4iY_Y63wrl' bind:this={turnstile}></fieldset>
			<input type='submit' value='제출' id='submit' />
		</form>
	</section>
</main>

<Footer />

<style>
	label, li, input#email, h4, p, textarea, input#submit {
		font-size: 18px;
	}

	a:visited {
		color: #0000ee;
	}
	
	h3 {
		font-size: 24px;
	}

	h1 {
		font-size: 48px;
	}

	h2 {
		font-size: 28px;
	}

	main {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
	}

	header {
		width: 100%;
		display: flex;
		flex-direction: column;
		text-align: center;
		align-items: center;
	}

	section#paper {
		width: 100%;
		max-width: 760px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		height: 98%;
	}

	@media (max-width: 425px) {
		h3 {
			font-size: 20px;
		}

		h1 {
			font-size: 40px;
		}

		h2 {
			font-size: 24px;
		}

		label, li, input#email, h4, p, textarea, input#submit {
			font-size: 16px;
		}
	}

	section#information {
		display: flex;
		justify-content: space-between;
		align-items: end;
		border-bottom: 1px solid #000000;
		margin-top: -8px;
		width: 98%;
	}

	textarea {
		resize: none;
		border: 1px solid #000000;
		outline: 1px solid #000000;
		outline-offset: -3px;
		padding: 3px;
		width: 100%;
		height: 100%;
	}

	form {
		width: 95%;
		max-width: 480px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-height: 740px;
		height: 100%;
	}

	fieldset {
		border: 0;
	}

	* {
		line-break: anywhere;
	}

	li:last-child {
		display: flex;
		gap: 4px;
		position: relative;
	}

	span {
		position: absolute;
		color: #ff0000;
		font-weight: 300;
		font-size: 24px;
		top: -5px;
	}

	input#email {
		width: 100%;
		max-width: 400px;
		border: 0;
		border-bottom: 1px solid #000000;
	}

	ol {
		list-style: none;
		display: flex;
		flex-direction: column;
	}

	section#notice {
		width: 100%;
		padding: 16px;
		border: 1px solid #000000;
		margin-top: 16px;
	}
</style>