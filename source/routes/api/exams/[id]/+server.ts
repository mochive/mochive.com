import { JsendStatus } from '$lib/constant';
import { kysely } from '$lib/server/database';
import type { Database, Exam, ExamAsset, ExamRank } from '$lib/type';
import { getJsendResponse } from '$lib/utility';
import { sql, type Transaction } from 'kysely';
import type { RequestEvent } from '@sveltejs/kit';

export function GET(event: RequestEvent<{
	id: string;
}>): Response | Promise<Response> {
	const id: number = Number(event['params']['id']);
	
	if(Number.isInteger(id) && id > 0) {
		return kysely.transaction()
		.setIsolationLevel('repeatable read')
		.execute(function (transaction: Transaction<Database>): Promise<Response> {
			let exam: Exam;

			return transaction.selectFrom('exam')
			.select(['id', 'name', 'month', 'grade', 'subject', 'question_count as questionCount', 'time', sql<string>`to_char(taken_at, 'YYYY-MM-DD')`.as('takenAt')])
			.where('id', '=', id)
			.executeTakeFirst()
			.then(function (rawExam?: Exam): Promise<[Pick<ExamAsset, 'id' | 'type' | 'path'>[], Pick<ExamRank, 'id' | 'grade' | 'rawScore' | 'standardScore' | 'percentile'>[]]> {
				if(rawExam !== undefined) {
					exam = rawExam;

					return Promise.all([transaction.selectFrom('exam_asset')
					.select(['id', 'type', 'path'])
					.where('exam_id', '=', id)
					.orderBy('type')
					.execute(), transaction.selectFrom('exam_rank')
					.select(['id', 'grade', 'raw_score as rawScore', 'standard_score as standardScore', 'percentile'])
					.where('exam_id', '=', id)
					.orderBy('grade')
					.execute()]);
				}	else {
					throw getJsendResponse('Parameter[\'id\'] must be valid', JsendStatus['FAIL']);
				}
			})
			.then(function (examAssetsAndRanks: [Pick<ExamAsset, 'id' | 'type' | 'path'>[], Pick<ExamRank, 'id' | 'grade' | 'rawScore' | 'standardScore' | 'percentile'>[]]): Response {
				return getJsendResponse(Object.assign(exam, {
					assets: examAssetsAndRanks[0],
					ranks: examAssetsAndRanks[1]
				}));
			});
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