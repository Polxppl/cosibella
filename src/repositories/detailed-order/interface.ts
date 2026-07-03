import { DetailedOrder } from '../../resources/detailed-order';

export interface DetailedOrderRepository {
  getDetailedOrders(): Promise<Array<DetailedOrder>>;
}
