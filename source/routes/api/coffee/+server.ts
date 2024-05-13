import { JsendStatus } from '$lib/constant';
import { getJsendResponse } from '$lib/utility';

export function GET(): Response {
	return getJsendResponse('I\'m sorry, but this server is powered by Teapot™', JsendStatus['FAIL'], 418);
}

export function POST(): Response {
	return getJsendResponse('I\'m sorry, but this server is powered by Teapot™', JsendStatus['FAIL'], 418);
}

export function fallback(): Response {
	return getJsendResponse('Method must be valid', JsendStatus['FAIL'], 405);
}