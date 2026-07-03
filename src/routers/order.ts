import { type Express } from 'express';
import { OrderController } from '../controllers/order';

export class OrderRouter {
  constructor(private orderController: OrderController) {}

  public setup(server: Express) {
    server.get('/orders', async (req, res) => {
      await this.orderController.getDetailedOrders(req, res);
    })

    server.put('/order/:orderSerialNumber/productsCost', async (req, res) => {
      await this.orderController.changeOrderProductsCost(req, res);
    })
  }

}
