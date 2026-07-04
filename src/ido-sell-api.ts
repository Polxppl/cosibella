import axios, { AxiosInstance }  from 'axios';
import { DocumentType } from './resources/document';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import Ajv from 'ajv';

const ajv = new Ajv();

const orderPaymentsSchema = {
  type: 'object',
  properties: {
    orderCurrency: {
      type: 'object',
      properties: {
        orderProductsCost: { type: 'number' },
        currencyId: { type: 'string' },
      },
      required: ['orderProductsCost', 'currencyId'],
    }
  },
  required: ['orderCurrency']
} as const satisfies JSONSchema;

const orderSchema = {
  type: 'object',
  properties: {
    orderId: { type: 'string' },
    orderSerialNumber: { type: 'number' },
    orderDetails: {
      type: 'object',
      properties: {
        payments: orderPaymentsSchema
      },
      required: ['payments'],
    }
  },
  required: ['orderId', 'orderSerialNumber', 'orderDetails']
} as const satisfies JSONSchema;

const orderSearchResponseSchema = {
  type: 'object',
  properties: {
    resultsNumberPage: { type: 'number' },
    resultsPage: { type: 'number' },
    resultsLimit: { type: 'number' },
    Results: {
      type: 'array',
      items: orderSchema,
    },
  },
  required: ['resultsNumberPage', 'resultsPage', 'resultsLimit', 'Results'],
} as const satisfies JSONSchema;

export type OrderSearchResponse = FromSchema<typeof orderSearchResponseSchema>;

const orderSearchResponseValidator = ajv.compile<OrderSearchResponse>(orderSearchResponseSchema);

const documentsResponseSchema = {
  type: 'object',
  properties: {
    documents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          documentId: { type: 'string' },
          documentType: { type: 'string' },
        },
      },
    }
  },
  required: ['documents']
} as const satisfies JSONSchema;

type DocumentsResponse = FromSchema<typeof documentsResponseSchema>;

type ParsedDocumentsResponse = { documents: { documentId: string, documentType: string } };

const documentsResponseValidator = ajv.compile<DocumentsResponse>(documentsResponseSchema);

export class IdoSellApi {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: process.env['IDO_SELL_URL'],
      headers: {
        'X-API-KEY': process.env['IDO_SELL_API_KEY'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
  }

  public async getOrders(resultsPage: number): Promise<OrderSearchResponse> {
    const { data } = await this.api.post(
      'orders/orders/search',
      { params: { resultsLimit: 10, resultsPage, ordersBy: [{ elementName: 'order_time', sortDirection: 'ASC' }] }}
    );
    if (!orderSearchResponseValidator(data)) {
      throw new Error(ajv.errorsText(orderSearchResponseValidator.errors));
    }
    return data;
  }

  public async getOrderDocuments(orderSerialNumber: number, documentType: DocumentType): Promise<ParsedDocumentsResponse> {
    const { data } = await this.api.get(`orders/documents?orderSerialNumber=${orderSerialNumber}&documentType=${documentType}&returnElements=documentId,documentType`);
    if (!documentsResponseValidator(data)) {
      throw new Error(ajv.errorsText(documentsResponseValidator.errors));
    }
    const onlyNotEmptyDocuments = data.documents.filter((el) => 'documentId' in el && 'documentType' in el);
    return { documents: onlyNotEmptyDocuments } as unknown as ParsedDocumentsResponse;
  }
}

