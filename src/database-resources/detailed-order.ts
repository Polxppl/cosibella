import { DetailedOrder } from '../resources/detailed-order';

export type DbDetailedOrder = Pick<DetailedOrder, 'id' | 'documents'> & {
  products_cost: DetailedOrder['productsCost'],
  serial_number: DetailedOrder['serialNumber'],
}
