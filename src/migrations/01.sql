BEGIN;
CREATE SCHEMA app AUTHORIZATION cosi;

CREATE TABLE app."order" (
	id varchar NOT NULL,
	serial_number integer NOT NULL,
	products_cost integer NOT NULL,
	CONSTRAINT order_pk PRIMARY KEY (serial_number)
);

CREATE TYPE app.document_type AS ENUM (
	'sales_confirmation',
	'vat_invoice'
);

CREATE TABLE app."document" (
	id varchar NOT NULL,
	"type" app.document_type NOT NULL,
	order_serial_number INTEGER NOT NULL,
	CONSTRAINT document_pk PRIMARY KEY (id),
	CONSTRAINT document_order_fk FOREIGN KEY (order_serial_number) REFERENCES app."order"(serial_number) ON DELETE CASCADE ON UPDATE CASCADE
);


COMMIT;
