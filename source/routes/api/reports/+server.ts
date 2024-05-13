import { EMAIL_REGULAR_EXPRESSION, JsendStatus } from '$lib/constant';
import { kysely } from '$lib/server/database';
import type { Report } from '$lib/type';
import { getJsendResponse } from '$lib/utility';
import type { RequestEvent } from '@sveltejs/kit';
import { TURNSTILE_SECRET } from '$env/static/private';

export function POST(event: RequestEvent): Promise<Response> {
	return event['request'].json()
	.then(function (requestJson: Record<'email' | 'content' | 'token', string>): Promise<Pick<Report, 'id'>> {
		if(typeof(requestJson) === 'object') {
			if(EMAIL_REGULAR_EXPRESSION.test(requestJson['email'])) {
				if(typeof(requestJson['content']) === 'string') {
					if(requestJson['content']['length'] !== 0) {
						if(requestJson['content']['length'] <= 2048) {
							const formData: FormData = new FormData();

							formData.set('secret', TURNSTILE_SECRET);
							formData.set('response', requestJson['token']);

							return event.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
								method: 'POST',
								body: formData
							})
							.then(function (response: Response): Promise<Record<string, unknown>> {
								return response.json();
							})
							.then(function (responseJson: Record<string, unknown>): Promise<Pick<Report, 'id'>> {
								console.log(responseJson)
								if(responseJson['success']) {
									return kysely.insertInto('report')
									.values({
										email: requestJson['email'],
										content: requestJson['content']
									})
									.returning('id')
									.executeTakeFirstOrThrow();
								} else {
									throw getJsendResponse('Body[\'token\'] must be valid', JsendStatus['FAIL']);
								}
							})
							.catch(function (): Promise<Pick<Report, 'id'>> {
								throw getJsendResponse('Body[\'token\'] must be valid', JsendStatus['FAIL']);
							});
						} else {
							throw getJsendResponse('Body[\'content\'] must be shorter than 2048', JsendStatus['FAIL']);
						}
					} else {
						throw getJsendResponse('Body[\'content\'] must be longer than 1', JsendStatus['FAIL']);
					}
				} else {
					throw getJsendResponse('Body[\'content\'] must be string', JsendStatus['FAIL']);
				}
			} else {
				throw getJsendResponse('Body[\'email\'] must match ' + EMAIL_REGULAR_EXPRESSION, JsendStatus['FAIL']);
			}
		} else {
			throw getJsendResponse('Body must exist', JsendStatus['FAIL']);
		}
	})
	.then(function (report: Pick<Report, 'id'>): Response {
		return getJsendResponse(report, JsendStatus['SUCCESS'], 201);
	})
	.catch(function (error: unknown): Response {
		return error instanceof Response ? error : getJsendResponse(error instanceof Error ? error['message'] : 'Unknown error', JsendStatus['ERROR']);
	});
}

export function fallback(): Response {
	return getJsendResponse('Method must be valid', JsendStatus['FAIL'], 405);
}