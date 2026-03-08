#!/bin/sh
# wait-for-db.sh
set -e

host="$DB_HOST"
port="$DB_PORT"
user="$DB_USER"

echo "Waiting for Postgres at $host:$port..."

until pg_isready -h "$host" -p "$port" -U "$user"; do
  echo "Postgres is unavailable - sleeping 2s..."
  sleep 2
done

echo "Postgres is up - starting backend"
exec "$@"