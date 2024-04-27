import { JsendStatus } from '$lib/constant';
import { kysely } from '$lib/server/database';
import type { Database, Exam, ExamRank } from '$lib/type';
import { getJsendResponse } from '$lib/utility';
import { type Transaction } from 'kysely';
import type { RequestEvent } from '@sveltejs/kit';

export function GET(event: RequestEvent<{
	id: string;
}>): Response | Promise<Response> {
	const id: number = Number(event['params']['id']);
	
	if(Number.isInteger(id) && id > 0) {
		return kysely.transaction()
		.setIsolationLevel('repeatable read')
		.execute(function (transaction: Transaction<Database>): Promise<Response> {
			return transaction.selectFrom('exam')
			.select(['month', 'grade', 'subject'])
			.where('id', '=', id)
			.executeTakeFirst()
			.then(function (exam?: Pick<Exam, 'month' | 'grade' | 'subject'>): Promise<Pick<ExamRank, 'id' | 'grade' | 'rawScore' | 'standardScore' | 'percentile'>[]> | Pick<ExamRank, 'id' | 'grade' | 'rawScore' | 'standardScore' | 'percentile'>[] {
				if(typeof(exam) !== 'undefined') {
					return transaction.selectFrom('exam_rank')
					.select(['id', 'grade', 'raw_score as rawScore', 'standard_score as standardScore', 'percentile'])
					.where('exam_id', '=', id)
					.orderBy('grade')
					.execute();
				}	else {
					throw getJsendResponse('Parameter[\'id\'] must be valid', JsendStatus['FAIL']);
				}
			})
			.then(getJsendResponse);
		})
		.catch(function (error: unknown): Response {
			return error instanceof Response ? error : getJsendResponse(error instanceof Error ? error['message'] : 'Unknown error', JsendStatus['ERROR']);
		});
		
	} else {
		return getJsendResponse('Parameter[\'id\'] must be valid', JsendStatus['FAIL']);
	}
}

export function fallback(): Response {
	return getJsendResponse('Method must be valid', JsendStatus['FAIL'], 405);
}