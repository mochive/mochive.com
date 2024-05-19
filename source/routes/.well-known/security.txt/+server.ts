export function GET(): Response {
	const body: string = 'Contact: mailto:me@kangmin.kim\nContact: mailto:support@mochive.com\nExpires: ' + ((new Date()).getFullYear() + 1) + '-01-01T00:00:00.000Z\nPreferred-Languages: ko, en\nCanonical: https://mochive.com/.well-known/security.txt';

	return new Response(body, {
		headers: {
			'Content-Length': String(Buffer.from(body)['byteLength'])
		}
	});
}
