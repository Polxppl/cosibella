import { Document } from '../../resources/document';
import { Order } from '../../resources/order';
import { BaseRepository, Sql } from '../base';
import { DocumentRepository } from './interface';

export class PostgresDocumentRepository extends BaseRepository implements DocumentRepository {
  public withTransaction(tx: Sql): this {
    return new PostgresDocumentRepository(tx) as this;
  }

  public async upsertDocuments(orderSerialNumber: Order['serialNumber'], documents: Array<Document>): Promise<void> {
    await this.db.none(`
      INSERT INTO app.document (id, type, order_serial_number)
      SELECT
        documents.id,
        documents.type,
        $[orderSerialNumber] as order_serial_number
      FROM json_to_recordset($[values]) AS documents(id varchar, type app.document_type)
      ON CONFLICT (id) DO UPDATE
      SET type = EXCLUDED.type, order_serial_number = EXCLUDED.order_serial_number
    `, { orderSerialNumber, values: JSON.stringify(documents) });
  }
}
