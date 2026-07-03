#!/bin/bash
set -e

echo "Running migrations as user '$DB_USER'..."

for f in /migrations/*.sql; do
    echo "Applying $f..."
    psql -v ON_ERROR_STOP=1 --username "$DB_USER" -f "$f"
done

echo "All migrations applied successfully!"
