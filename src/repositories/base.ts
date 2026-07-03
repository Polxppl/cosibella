import type { IDatabase, ITask } from 'pg-promise';

export type Sql = IDatabase<unknown> | ITask<unknown>;

export abstract class BaseRepository {
  constructor(public db: Sql) { }

  abstract withTransaction(tx: Sql): this;
}
