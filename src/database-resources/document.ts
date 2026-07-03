import { Document } from '../resources/document';
import { Order } from '../resources/order';

export type DbDocument = Pick<Document, 'id' | 'type' > & {
  order_id: Order['id'],
}
