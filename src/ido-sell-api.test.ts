import axios from 'axios';
import test from 'tape';
import { DocumentsResponse, IdoSellApi, OrderSearchResponse } from './ido-sell-api';

test('IdoSell api', (describe) => {
  describe.test('getOrders resolve when api results with proper response', async (it) => {
    const data: OrderSearchResponse = {
      Results: [{
        orderId: '1',
        orderSerialNumber: 1,
        orderDetails: { payments: { orderCurrency: { currencyId: 'currencyId', orderProductsCost: 0 }}}
      }],
      resultsLimit: 0,
      resultsNumberPage: 0,
      resultsPage: 0,
    }
    const axiosInstance = axios.create({
      adapter: async (config) => {
        return { data, config, headers: {}, status: 200, statusText: 'OK' }
      }}
    )
    const idoSellApi = new IdoSellApi(axiosInstance);
    const result = await idoSellApi.getOrders(0);
    it.deepEqual(result, data);
  });

  describe.test('getOrders throw an error when api results with invalid response', async (it) => {
    const data = {}
    const axiosInstance = axios.create({
      adapter: async (config) => {
        return { data, config, headers: {}, status: 200, statusText: 'OK' }
      }}
    )
    const idoSellApi = new IdoSellApi(axiosInstance);
    try {
      await idoSellApi.getOrders(0);
    } catch (err) {
      it.throws(() => { throw err })
    }
  });

  describe.test('getOrderDocuments throw an error when api results with invalid response', async (it) => {
    const data = {}
    const axiosInstance = axios.create({
      adapter: async (config) => {
        return { data, config, headers: {}, status: 200, statusText: 'OK' }
      }}
    )
    const idoSellApi = new IdoSellApi(axiosInstance);
    try {
      await idoSellApi.getOrderDocuments(0, 'vat_invoice');
    } catch (err) {
      it.throws(() => { throw err })
    }
  });

  describe.test('getOrderDocuments resolve when api results with proper response', async (it) => {
    const data: DocumentsResponse = {
      documents: [{ documentId: '0', documentType: 'vat_invoice' }]
    }
    const axiosInstance = axios.create({
      adapter: async (config) => {
        return { data, config, headers: {}, status: 200, statusText: 'OK' }
      }}
    )
    const idoSellApi = new IdoSellApi(axiosInstance);
    const result = await idoSellApi.getOrderDocuments(0, 'vat_invoice');
    it.deepEqual(result, data);
  });

  describe.test('getOrderDocuments results with empty array when api response with incomplete data', async (it) => {
    const data: DocumentsResponse = {
      documents: [{ documentType: 'vat_invoice' }]
    }
    const axiosInstance = axios.create({
      adapter: async (config) => {
        return { data, config, headers: {}, status: 200, statusText: 'OK' }
      }}
    )
    const idoSellApi = new IdoSellApi(axiosInstance);
    const result = await idoSellApi.getOrderDocuments(0, 'vat_invoice');
    it.deepEqual(result, { documents: [] });
  });
})
