import { ERRORS } from '../errors';
import { OrderRepository } from '../repositories/order/interface';
import { Order } from '../resources/order';

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  public async changeOrderProductsCost(productsCost: Order["productsCost"], orderSerialNumber: Order["serialNumber"]): Promise<void> {
    const orderExists = await this.orderRepository.orderExists(orderSerialNumber);
    if (!orderExists) {
      throw new Error(ERRORS.NOT_FOUND);
    }
    await this.orderRepository.changeProductsCost(productsCost, orderSerialNumber);
  }
}
