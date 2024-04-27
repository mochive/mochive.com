import { kysely } from '$lib/server/database';
import type { Database, Exam } from '$lib/type';
import { sql, type SelectQueryBuilder } from 'kysely';
import type { RequestEvent } from '../$types';
import { getJsendResponse } from '$lib/utility';
import { JsendStatus, MONTHS } from '$lib/constant';

export function GET(event: RequestEvent): Promise<Response> | Response {
	try {
		let startYear: number;
		let currentYear: number;
		const isStartYearDefined: boolean = event['url']['searchParams'].has('startYear');
	
		// TODO: Add term
		
		return kysely.selectFrom('exam')
		.select(['id', 'name', 'month', 'grade', 'subject', 'question_count as questionCount', 'time', sql<string>`to_char(taken_at, 'YYYY-MM-DD')`.as('takenAt')])
		.$if(true, function (queryBuilder: SelectQueryBuilder<Database, 'exam', Exam>): SelectQueryBuilder<Database, 'exam', Exam> {
			let size: number;
			let index: number;

			if(event['url']['searchParams'].has('page[order]')) {
				const order: string | null = event['url']['searchParams'].get('page[order]');

				switch(order) {
					case 'asc':
					case 'desc': {
						queryBuilder = queryBuilder.orderBy('takenAt', order);

						break;
					}

					default: {
						throw getJsendResponse('Query[\'page[order]\'] must be asc or desc');
					}
				}
			} else {
				queryBuilder = queryBuilder.orderBy('takenAt', 'desc');
			}


			if(event['url']['searchParams'].has('page[size]')) {
				size = Number(event['url']['searchParams'].get('page[size]'));

				if(!Number.isInteger(size) || size < 1 || size > 128) {
					throw getJsendResponse('Query[\'page[order]\'] must be between 1 and 128');
				}
			} else {
				size = 50;
			}

			queryBuilder = queryBuilder.limit(size);

			if(event['url']['searchParams'].has('page[index]')) {
				index = Number(event['url']['searchParams'].get('page[index]'));

				if(Number.isInteger(index) && index >= 0) {
					queryBuilder = queryBuilder.offset(size * index);
				} else {
					throw getJsendResponse('Query[\'page[index]\'] must be integer not less than 0');
				}
			}

			return queryBuilder;
		})
		.orderBy('grade', 'asc')
		.orderBy('subject', 'asc')
		.orderBy('id', 'desc')
		.$if(event['url']['searchParams'].has('month'), function (queryBuilder: SelectQueryBuilder<Database, 'exam', Exam>): SelectQueryBuilder<Database, 'exam', Exam> {
			const months: Exam['month'][] = [];
	
			for(const rawMonth of event['url']['searchParams'].getAll('month')) {
				const month: number = Number(rawMonth);
				
				if(MONTHS.has(month as Exam['month'])) {
					months.push(month as Exam['month']);
				} else {
					throw getJsendResponse('Query[\'month\'] must be one of ' + Array.from(MONTHS).join(', '), JsendStatus['FAIL']);
				}
			}
	
			return queryBuilder.where('month', 'in', months);
		})
		.$if(event['url']['searchParams'].has('grade'), function (queryBuilder: SelectQueryBuilder<Database, 'exam', Exam>): SelectQueryBuilder<Database, 'exam', Exam> {
			const grades: Exam['grade'][] = [];
	
			for(const rawGrade of event['url']['searchParams'].getAll('grade')) {
				const grade: number  = Number(rawGrade);
				
				if(grade >= 1 && grade <= 3) {
					grades.push(grade as Exam['grade']);
				} else {
					throw getJsendResponse('Query[\'grade\'] must be between 1 and 3', JsendStatus['FAIL']);
				}
			}
	
			return queryBuilder.where('grade', 'in', grades);
		})
		.$if(event['url']['searchParams'].has('subject'), function (queryBuilder: SelectQueryBuilder<Database, 'exam', Exam>): SelectQueryBuilder<Database, 'exam', Exam> {
			const subjects: Exam['subject'][] = [];
	
			for(const rawSubject of event['url']['searchParams'].getAll('subject')) {
				const subject: number = Number(rawSubject);

				if(subject >= 1 && subject <= 8) {
					subjects.push(subject as Exam['subject']);
				} else {
					throw getJsendResponse('Query[\'subject\'] must be /^[1-8]$/', JsendStatus['FAIL']);
				}
			}
	
			return queryBuilder.where('subject', 'in', subjects);
		})
		.$if(isStartYearDefined, function (queryBuilder: SelectQueryBuilder<Database, 'exam', Exam>): SelectQueryBuilder<Database, 'exam', Exam> {
			currentYear = (new Date()).getFullYear();
			startYear = Number(event['url']['searchParams'].get('startYear'));

			if(Number.isInteger(startYear) && startYear >= 2006 && startYear <= currentYear) {
				return queryBuilder.where(sql<number>`DATE_PART('year', taken_at)`, '>=', startYear);
			} else {
				throw getJsendResponse('Query[\'startYear\'] must be between 2006 and ' + currentYear, JsendStatus['FAIL']);
			}
		})
		.$if(event['url']['searchParams'].has('endYear'), function (queryBuilder: SelectQueryBuilder<Database, 'exam', Exam>): SelectQueryBuilder<Database, 'exam', Exam> {
			if(!isStartYearDefined) {
				startYear = 2006;
			}
			
			const endYear: number = Number(event['url']['searchParams'].get('endYear'));
	
			if(Number.isInteger(endYear) && endYear >= startYear && endYear <= currentYear) {
				return queryBuilder.where(sql<number>`DATE_PART('year', taken_at)`, '<=', endYear);
			} else {
				throw getJsendResponse('Query[\'endYear\'] must be between ' + startYear + ' and ' + currentYear, JsendStatus['FAIL']);
			}
		})
		.execute()
		.then(getJsendResponse)
		.catch(function (error: unknown): Response {
			return getJsendResponse(error instanceof Error ? error['message'] : 'Unknown error', JsendStatus['ERROR']);
		});
	} catch(error: unknown) {
		return error instanceof Response ? error : getJsendResponse(error instanceof Error ? error['message'] : 'Unknown error', JsendStatus['ERROR']);
	}
}

export function fallback(): Response {
	return getJsendResponse('Method must be valid', JsendStatus['FAIL'], 405);
}