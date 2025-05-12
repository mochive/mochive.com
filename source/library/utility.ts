import { JsendStatus } from './constant';

const encoder: TextEncoder = new TextEncoder();
const decoder: TextDecoder = new TextDecoder();

export function base64Encode(text: string): string {
	return btoa(String.fromCharCode.apply(null, encoder.encode(text) as unknown as number[])).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function base64Decode(text: string): string {
	const decodedCharacters: (string | number)[] = Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')));

	for(let i: number = 0; i < decodedCharacters['length']; i++) {
		decodedCharacters[i] = (decodedCharacters[i] as string).charCodeAt(0);
	}

	return decoder.decode(new Uint8Array(decodedCharacters as number[]));
}

export function getBitsPositions(number: number): number[] {
  const positions: number[] = [];
  let position: number = 1;

  while(number !== 0) {
    if(number & 1) {
      positions.push(position);
    }

    number >>= 1;
    position++;
  }

  return positions;
}

export function getNumbers(query: string, currentIndex: number = 0): number[] {
	query += ',';
	
	const array: number[] = [];
	let nextIndex: number = query.indexOf(',');

	while(nextIndex !== -1) {
		array.push(Number(query.slice(currentIndex, nextIndex)));

		currentIndex = nextIndex + 1;
		nextIndex = query.indexOf(',', currentIndex);
	}

	return array;
}

export function fetchJsend<T>(url: string, init?: RequestInit): Promise<T> {
	return fetch(url, Object.assign({
		mode: 'no-cors'
	}, init))
	.then(function (response: Response): Promise<{
		status: string;
		data: T;
	}> {
		if(response['status'] === 200) {
			return response.json();
		} else {
			throw response;
		}
	})
	.then(function (responseJson: {
		status: string;
		data: T;
	}): T {
		return responseJson['data'];
	});
}

export function getJsendResponse(data: unknown, status: JsendStatus = JsendStatus['SUCCESS'], code?: number): Response {
	switch(status) {
		case JsendStatus['SUCCESS']: {
			if(typeof(code) !== 'number') {
				code = 200;
			}

			data = 'success","data":' + JSON.stringify(data);

			break;
		}
		
		case JsendStatus['FAIL']: {
			if(typeof(data) === 'string') {
				if(typeof(code) !== 'number') {
					code = 400;
				}

				data = 'fail","data":{"title":"' + data.replace(/\"/g, '\\"') + '"}';

				break;
			} else {
				throw new Error('Data must be string');
			}
		}
		
		case JsendStatus['ERROR']: {
			if(typeof(data) === 'string') {
				if(typeof(code) !== 'number') {
					code = 500;
				}

				data = 'error","code":' + code + ',"message":"' + data.replace(/\"/g, '\\"') + '"';

				break;
			} else {
				throw new Error('Data must be string');
			}
		}
	}

	data = '{"status":"' + data + '}';

	return new Response(data as string, {
		status: code,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Content-Length': String(Buffer.from(data as string)['byteLength'])
		}
	});
}

export function loadImage(url: string): Promise<string> {
	return new Promise<string>(function (resolve: (value: string) => void, reject: (reason?: unknown) => void): void {
		const image = new Image();

		image['src'] = url;

		image.addEventListener('load', function (): void {
			resolve(url);

			return;
		});
		image.addEventListener('error', reject);

		return;
	});
}