import { Order } from '../../resources/order';
import { BaseRepository, Sql } from '../base';
import { OrderRepository } from './interface';
import { OrderParser } from './parser';

export class PostgresOrderRepository extends BaseRepository implements OrderRepository {
  public withTransaction(tx: Sql): this {
    return new PostgresOrderRepository(tx) as this;
  }

  public async upsertOrders(orders: Array<Order>): Promise<void> {
    const parsedOrders = orders.map((el) => OrderParser.toDb(el));
    await this.db.none(`
      INSERT INTO app.order (id, serial_number, products_cost)
      SELECT
        orders.id,
        orders.serial_number,
        orders.products_cost
      FROM json_to_recordset($[values]) AS orders(id varchar, serial_number integer, products_cost integer)
      ON CONFLICT (serial_number) DO UPDATE
      SET serial_number = EXCLUDED.serial_number, products_cost = EXCLUDED.products_cost
    `, { values: JSON.stringify(parsedOrders) });
  }

  public async changeProductsCost(productsCost: Order['productsCost'], orderSerialNumber: Order['serialNumber']): Promise<void> {
    await this.db.none(`
      UPDATE app."order" SET products_cost = $[productsCost] WHERE serial_number = $[orderSerialNumber]
    `, { productsCost: OrderParser.productsCostToDb(productsCost), orderSerialNumber })
  }

  public async orderExists(orderSerialNumber: Order['serialNumber']): Promise<boolean> {
    const result = await this.db.one<{ exists: boolean }>(`
      SELECT EXISTS(SELECT o.serial_number FROM app."order" o WHERE o.serial_number = $[orderSerialNumber])
    `, { orderSerialNumber });
    return result.exists;
  }
}
