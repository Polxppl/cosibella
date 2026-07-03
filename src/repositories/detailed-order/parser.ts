import { DbDetailedOrder } from '../../database-resources/detailed-order';
import { DetailedOrder } from '../../resources/detailed-order';

export class DetailedOrderParser {
  static fromDb(dbOrder: DbDetailedOrder): DetailedOrder {
    const { products_cost, serial_number, ...el } = dbOrder;
    return { productsCost: products_cost / 100, serialNumber: serial_number, ...el };
  }
}
