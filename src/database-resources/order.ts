import { Order } from '../resources/order';

export type DbOrder = Pick<Order, 'id'> & {
  serial_number: Order['serialNumber'],
  products_cost: Order['productsCost'],
}
