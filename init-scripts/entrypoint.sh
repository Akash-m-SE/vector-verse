#!/bin/sh
set -e

# Flag for scripts
INIT_FLAG="/var/lib/postgresql/data/pg_initialized"

echo "Starting PostgreSQL server..."
docker-entrypoint.sh postgres &

echo "Waiting for PostgreSQL to start..."
until pg_isready -h "$POSTGRES_HOST" -U "$POSTGRES_USER"; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

if [ ! -f "$INIT_FLAG" ]; then
  echo "Updating Packages, Installing dependencies and pgvector..."
  apt-get update
  apt-get install -y git build-essential postgresql-server-dev-16

  # Clean up any existing pgvector directory before cloning
  if [ -d /tmp/pgvector ]; then
    rm -rf /tmp/pgvector
  fi

  echo "Cloning pgvector repository..."
  cd /tmp
  git clone --branch v0.7.2 https://github.com/pgvector/pgvector.git
  cd pgvector
  echo "Building and installing pgvector..."
  make
  make install

  echo "Creating pgvector extension in the database..."
  psql -U postgres -c "CREATE EXTENSION IF NOT EXISTS vector;"

  echo "Checking if database exists and creating if not..."
  psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE $POSTGRES_DB"

  touch "$INIT_FLAG"
  echo "Entrypoint script finished successfully."
fi

# Ensure PostgreSQL remains in the foreground
wait
