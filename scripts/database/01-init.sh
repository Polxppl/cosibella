#!/bin/bash
set -e

echo "Creating application user and database..."

psql -v ON_ERROR_STOP=1 --username "$DB_ROOT_USER" <<-EOSQL
    CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD' CREATEDB;
    CREATE DATABASE $DB_NAME;
    GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

echo "Database $DB_NAME and user $DB_USER created successfully!"
