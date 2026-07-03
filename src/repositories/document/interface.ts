import { Document } from '../../resources/document';
import { Order } from '../../resources/order';

export interface DocumentRepository {
  upsertDocuments(orderSerialNumber: Order['serialNumber'], documents: Array<Document>): Promise<void>
}
