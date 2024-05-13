import { JsendStatus } from '$lib/constant';
import { getJsendResponse } from '$lib/utility';

export function GET(): Response {
	return getJsendResponse({
		title: 'I\'m sorry, but this server is powered by Teapot™'
	}, JsendStatus['FAIL'], 418);
}

export function POST(): Response {
	return getJsendResponse({
		title: 'I\'m sorry, but this server is powered by Teapot™'
	}, JsendStatus['FAIL'], 418);
}