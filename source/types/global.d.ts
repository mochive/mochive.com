declare global {
	namespace App {
		//interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	
	namespace NodeJS {
		interface ProcessEnv extends Record<'DATABASE_URL' | 'SEARCH_DATABASE_URL', string> {
			NODE_ENV: 'development' | 'production';
		}
	}
}

export {};
