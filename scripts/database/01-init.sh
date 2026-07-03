#!/bin/bash
set -e

echo "Creating application user and database..."

psql -v ON_ERROR_STOP=1 --username "$DB_ROOT_USER" <<-EOSQL
    CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD' CREATEDB;
    CREATE DATABASE cosi;
    GRANT ALL PRIVILEGES ON DATABASE cosi TO $DB_USER;
EOSQL

echo "Database cosi and user $DB_USER created successfully!"
