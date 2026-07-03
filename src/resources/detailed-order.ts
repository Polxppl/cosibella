import { Document } from './document';
import { Order } from './order';

export type DetailedOrder = Order & {
  documents: Array<Document>,
};
