import { Order } from '../../resources/order';

export interface OrderRepository {
  orderExists(orderSerialNumber: Order['serialNumber']): Promise<boolean>,
  upsertOrders(orders: Array<Order>): Promise<void>,
  changeProductsCost(productsCost: Order['productsCost'], orderSerialNumber: Order['serialNumber']): Promise<void>
}
