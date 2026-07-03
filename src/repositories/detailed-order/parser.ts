import { DbDetailedOrder } from '../../database-resources/detailed-order';
import { DetailedOrder } from '../../resources/detailed-order';
import { OrderParser } from '../order/parser';

export class DetailedOrderParser {
  static fromDb(dbDetailedOrder: DbDetailedOrder): DetailedOrder {
    const { documents, ...dbOrder } = dbDetailedOrder;
    const order = OrderParser.fromDb(dbOrder)
    return { ...order, documents };
  }
}
