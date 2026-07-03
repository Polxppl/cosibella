import { DbOrder } from '../../database-resources/order';
import { Order } from '../../resources/order';

export class OrderParser {
  static productsCostToDb(value: number): number {
  return  Math.round(value * 100);
  }

  static fromDb(dbOrder: DbOrder): Order {
    const { products_cost, serial_number, currency_id, ...el } = dbOrder;
    return { productsCost: products_cost / 100, currencyId: currency_id, serialNumber: serial_number, ...el };
  }

  static toDb(order: Order): DbOrder {
    const { productsCost, serialNumber, currencyId, ...el } = order;
    return {
      products_cost: OrderParser.productsCostToDb(productsCost),
      currency_id: currencyId,
      serial_number: serialNumber,
      ...el
    };
  }
}
