import type { ColumnType } from 'kysely';

export interface Exam {
	id: number;
	name: string;
	month: 3 | 4 | 6 | 7 | 9 | 10 | 11;
	grade: 1 | 2 | 3;
	subject: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // Backward compatibility for EBSi
	questionCount: number;
	time: number;
	takenAt: string;
}

export interface ExamAsset {
	id: number;
	examId: number;
	type: 1 | 2 | 3 | 4 | 5;
	path: string;
}

export interface ExamRank {
	id: number;
	examId: number;
	grade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
	rawScore: number;
	standardScore: number;
	percentile: number;
}

type Generated<T> = T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export interface Database {
	exam: {
		id: Generated<number>;
		name: string;
		month: 3 | 4 | 6 | 7 | 9 | 10 | 11;
		grade: 1 | 2 | 3;
		subject: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
		question_count: number;
		time: number;
		taken_at: Date;
	};
	exam_asset: {
		id: Generated<number>;
		exam_id: number;
		type: 1 | 2 | 3 | 4 | 5;
		path: string;
	};
	exam_rank: {
		id: Generated<number>;
		exam_id: number;
		grade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
		raw_score: number;
		standard_score: number;
		percentile: number;
	};
}