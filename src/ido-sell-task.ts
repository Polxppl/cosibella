import { IdoSellApi, OrderSearchResponse } from './ido-sell-api';
import { DocumentRepository } from './repositories/document/interface';
import { OrderRepository } from './repositories/order/interface';
import { Document, DOCUMENT_TYPE } from './resources/document';
import { Order } from './resources/order';

export class IdoSellTask {
  private api: IdoSellApi;
  constructor(private orderRepository: OrderRepository, private documentRepository: DocumentRepository) {
    this.api = new IdoSellApi();
  }

  private async *orderIterator(): AsyncGenerator<OrderSearchResponse> {
    let page = 0;
    while (true) {
      const response = await this.api.getOrders(page);
      page++;
      yield response;
      if (response.resultsPage >= response.resultsNumberPage - 1) {
        return;
      }
    }
  }

  private async getOrderDocuments(orderSerialNumber: Order['serialNumber']): Promise<Array<Document>> {
    const documentsResponses = await Promise.allSettled([
      this.api.getOrderDocuments(orderSerialNumber, DOCUMENT_TYPE.SALES_CONFIRMATION),
      this.api.getOrderDocuments(orderSerialNumber, DOCUMENT_TYPE.VAT_INVOICE)
    ]);
    const rejectedDocumentsResponses = documentsResponses.filter((el) => el.status === 'rejected');
    rejectedDocumentsResponses.forEach((el) => console.error(el.reason));
    const fulfilledDocumentsResponses = documentsResponses.filter((el) => el.status === 'fulfilled');
    const documents = fulfilledDocumentsResponses.map((el) => el.value.documents).flat();
    return documents.map((el) => ({ type: el.documentType, id: el.documentId }));
  }

  private async handleOrderDocuments(el: OrderSearchResponse['Results'][number]): Promise<void> {
    const documents = await this.getOrderDocuments(el.orderSerialNumber);
    await this.documentRepository.upsertDocuments(el.orderSerialNumber, documents)
  }

  private parseOrder(order: OrderSearchResponse['Results'][number]): Order {
    return {
      id: order.orderId,
      productsCost: order.orderDetails.payments.orderCurrency.orderProductsCost,
      serialNumber: order.orderSerialNumber,
    }
  }

  public async run(): Promise<void> {
    const iterator = this.orderIterator();
    for await (const orders of iterator) {
      try {
        const parsedOrders = orders.Results.map((el) => this.parseOrder(el));
        await this.orderRepository.upsertOrders(parsedOrders);
        await Promise.allSettled(orders.Results.map((el) => this.handleOrderDocuments(el)));
      } catch (err) {
        console.error(err);
      }
    }
  }

}
