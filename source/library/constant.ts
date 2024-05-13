
import KoreanPaper from '$lib/assets/koreanPaper.svg?component';
import MathematicsPaper from '$lib/assets/mathematicsPaper.svg?component';
import EnglishPaper from '$lib/assets/englishPaper.svg?component';
import KoreanHistoryPaper from '$lib/assets/koreanHistoryPaper.svg?component';
import SocialStudyPaper from '$lib/assets/socialStudyPaper.svg?component';
import ScienceStudyPaper from '$lib/assets/scienceStudyPaper.svg?component';
import OccupationStudyPaper from '$lib/assets/occupationStudyPaper.svg?component';
import SecondLanguageOrClassicalChinesePaper from '$lib/assets/secondLanguageOrClassicalChinesePaper.svg?component';

import Memo from '$lib/assets/memo.svg?component';
import BookmarkTabs from '$lib/assets/bookmarkTabs.svg?component';
import Scroll from '$lib/assets/scroll.svg?component';
import SpeakerWithThreeSoundWaves from '$lib/assets/speakerWithThreeSoundWaves.svg?component';
import Newspaper from '$lib/assets/newspaper.svg?component';

import type { Exam } from './type';

export const SUBJECT_NAMES = [
	'국어',
	'수학',
	'영어',
	'한국사',
	'사회탐구',
	'과학탐구',
	'직업탐구',
	'제2외국어'
] as const;

export const QUERY_NAMES = ['grade', 'subject', 'month', 'startYear', 'endYear'] as const;

export const PAPERS = [KoreanPaper, MathematicsPaper, EnglishPaper, KoreanHistoryPaper, SocialStudyPaper, ScienceStudyPaper, OccupationStudyPaper, SecondLanguageOrClassicalChinesePaper] as const;

export const BUTTONS = [[Memo, '문제'], [BookmarkTabs, '정답'], [Scroll, '해설'], [SpeakerWithThreeSoundWaves, '듣기'], [Newspaper, '대본']] as const;

export const MONTHS: Set<Exam['month']> = new Set<Exam['month']>([3, 4, 6, 7, 9, 10, 11]);

export const MONTH_NAMES = [
	3,
	4,
	6,
	7,
	9,
	10,
	11
] as const;

//export const API_URL: string = 'https://api.mochive.com';

export const enum JsendStatus {
	SUCCESS,
	FAIL,
	ERROR
}

export const EXAM_RANK_SCORE_KEYS = ['rawScore', 'standardScore', 'percentile'] as const;

export const EMAIL_REGULAR_EXPRESSION: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;