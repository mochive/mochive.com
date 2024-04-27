import { JsendStatus } from '$lib/constant';
import { getJsendResponse } from '$lib/utility';

export function GET(): Response {
	return getJsendResponse({
		message: 'You have done great, you are doing great, and you will do great'
	});
}

export function fallback(): Response {
	return getJsendResponse('Method must be valid', JsendStatus['FAIL'], 405);
}