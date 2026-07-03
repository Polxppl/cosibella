import { DbOrder } from '../../database-resources/order';
import { Order } from '../../resources/order';

export class OrderParser {
  static productsCostToDb(value: number): number {
  return  Math.round(value * 100);
  }

  static fromDb(dbOrder: DbOrder): Order {
    const { products_cost, serial_number, ...el } = dbOrder;
    return { productsCost: products_cost / 100, serialNumber: serial_number, ...el };
  }

  static toDb(order: Order): DbOrder {
    const { productsCost, serialNumber, ...el } = order;
    return { products_cost: OrderParser.productsCostToDb(productsCost), serial_number: serialNumber, ...el };
  }
}
