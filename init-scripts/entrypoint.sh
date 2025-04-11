# entrypoint.sh script is absolutely not required for this build

#!/bin/sh
set -e

# Flag for scripts
INIT_FLAG="/var/lib/postgresql/data/pg_initialized"

if [ ! -f "$INIT_FLAG" ]; then
  echo "Installing pgvector..."
  # Use apk (Alpine package manager) instead of apt-get
  apk update
  apk install -y git build-essential postgresql-dev-16

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

  # Create the extension
  echo "CREATE EXTENSION IF NOT EXISTS vector;" | psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
  
  touch "$INIT_FLAG"
  echo "pgvector installation completed."
fi

# Execute the original entrypoint
exec docker-entrypoint.sh postgres