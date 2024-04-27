import { MONTH_NAMES, QUERY_NAMES } from '$lib/constant';
import type { Exam } from '$lib/type';
import { base64Decode, getBitsPositions } from '$lib/utility';
import type { LoadEvent } from '@sveltejs/kit';

export function load(event: LoadEvent): Promise<{
	query: string;
	exams: Exam[];
}> | {
	query: string;
	exams: Exam[];
} {
	if(event['url']['searchParams'].has('query')) {
		const rawQuery: string = base64Decode(event['url']['searchParams'].get('query') as string);

		let query: string = '';
		let queryIndex: number = 0;
		let currentIndex: number = 0;
		let nextIndex: number = rawQuery.indexOf(',');

		while(nextIndex !== -1 && queryIndex !== 5) {
			const rawQueryValue: number = Number(rawQuery.slice(currentIndex, nextIndex));
			const queryName: string = QUERY_NAMES[queryIndex];

			if(queryIndex < 2) {
				for(const queryValue of getBitsPositions(rawQueryValue)) {
					query += '&' + queryName + '=' + queryValue;
				}
			} else if(queryIndex === 2) {
				for(const queryValue of getBitsPositions(rawQueryValue)) {
					query += '&' + queryName + '=' + MONTH_NAMES[queryValue - 1];
				}
			} else {
				query += '&' + queryName + '=' + rawQueryValue;
			}

			currentIndex = nextIndex + 1;
			nextIndex = rawQuery.indexOf(',', currentIndex);
			queryIndex++;
		}
		
		if(queryIndex === 5 && currentIndex !== rawQuery['length']) {
			query += '&term=' + encodeURIComponent(rawQuery.slice(currentIndex));
		}

		query = query.slice(1);

		//query += '&page[size]=7000';
	
		return event.fetch('/api/exams?' + query)
		.then(function (response: Response): Promise<{
			status: 'success';
			data: Exam[];
		}> {
			if(response['status'] === 200) {
				return response.json();
			} else {
				throw null;
			}
		})
		.then(function (responseJson: {
			status: 'success';
			data: Exam[];
		}): {
			query: string;
			exams: Exam[];
		} {
			return {
				query: query,
				exams: responseJson['data']
			};
		})
		.catch(function (error: unknown): {
			query: string;
			exams: Exam[];
		} {
			console.error(error);

			return {
				query: '',
				exams: []
			};
		});
	} else {
		console.error(new Error('Query[\'query\'] must be exist'));

		return {
			query: '',
			exams: []
		};
	}
}