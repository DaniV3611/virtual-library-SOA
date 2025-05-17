#!/bin/bash
set -e

# Esperar a que la base de datos esté lista
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing alembic migrations"
alembic upgrade head

# Ejecutar la aplicación
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload