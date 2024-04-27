import type { Database } from '$lib/type';
import { PostgresDialect, Kysely } from 'kysely';
import pg from 'pg';
import { Client } from '@elastic/elasticsearch';

import { DATABASE_URL, SEARCH_DATABASE_URL } from '$env/static/private';

export const kysely: Kysely<Database> = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: new pg.Pool({
			connectionString: DATABASE_URL,
			options: "-c search_path=mochive"
		})
	})
});

export const elasticsearch: Client = new Client({
	node: SEARCH_DATABASE_URL
});