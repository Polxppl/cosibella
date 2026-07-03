export const DOCUMENT_TYPE = {
  SALES_CONFIRMATION: 'sales_confirmation',
  VAT_INVOICE: 'vat_invoice'
} as const;

export type DocumentType = typeof DOCUMENT_TYPE[keyof typeof DOCUMENT_TYPE];

export type Document = {
  id: string;
  type: string;
}
