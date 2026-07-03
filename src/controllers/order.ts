import { DetailedOrderRepository } from '../repositories/detailed-order/interface';
import type { Request, Response } from 'express';
import { OrderService } from '../services/order';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import Ajv from 'ajv';
import { ERRORS } from '../errors';

const ajv = new Ajv();

const changeOrderProductsCostRequestSchema = {
  type: 'object',
  properties: {
    productsCost: { type: 'number' },
    orderSerialNumber: { type: 'number' },
  },
  required: ['productsCost', 'orderSerialNumber'],
} as const satisfies JSONSchema;

type ChangeOrderProductsCostRequest = FromSchema<typeof changeOrderProductsCostRequestSchema>;
const changeOrderProductsCostRequestValidator = ajv.compile(changeOrderProductsCostRequestSchema);

export class OrderController {
  constructor(private detailedOrderRepository: DetailedOrderRepository, private orderService: OrderService) {}

  public async getDetailedOrders(_req: Request, res: Response): Promise<void> {
    const result = await this.detailedOrderRepository.getDetailedOrders();
    res.json(result);
  }

  private parseChangeOrderProductsCostRequest(req: Request): ChangeOrderProductsCostRequest {
    const productsCost = req.body.productsCost;
    const orderSerialNumber = Number(req.params.orderSerialNumber);
    const data = { productsCost, orderSerialNumber };
    if (!changeOrderProductsCostRequestValidator(data)) {
      throw new Error(ERRORS.INVALID_REQUEST);
    }
    return data;
  }

  public async changeOrderProductsCost(req: Request, res: Response): Promise<void> {
    const { orderSerialNumber, productsCost } = this.parseChangeOrderProductsCostRequest(req);
    await this.orderService.changeOrderProductsCost(productsCost, orderSerialNumber);
    res.status(200).send();
  }
}
