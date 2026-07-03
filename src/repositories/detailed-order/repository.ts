import { DbDetailedOrder } from '../../database-resources/detailed-order';
import { DetailedOrder } from '../../resources/detailed-order';
import { BaseRepository, Sql } from '../base';
import { DetailedOrderRepository } from './interface';
import { DetailedOrderParser } from './parser';

export class PostgresDetailedOrderRepository extends BaseRepository implements DetailedOrderRepository {
  public withTransaction(tx: Sql): this {
    return new PostgresDetailedOrderRepository(tx) as this;
  }

  public async getDetailedOrders(): Promise<Array<DetailedOrder>> {
    const result = await this.db.manyOrNone<DbDetailedOrder>(`
      SELECT
        o.id,
        o.serial_number,
        o.products_cost,
        o.currency_id,
        COALESCE(json_agg(json_build_object('id', d.id, 'type', d.type)), '[]'::json) AS documents
      FROM app."order" o
      LEFT JOIN app."document" d ON d.order_serial_number = o.serial_number
      GROUP BY o.serial_number
      ORDER BY o.serial_number
    `);

    return result.map((el) => DetailedOrderParser.fromDb(el));
  }
}
