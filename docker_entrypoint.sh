#!/bin/sh

# Maximum number of retries
RETRIES=10
COUNTER=0

echo "Waiting for PostgreSQL to be ready..."

# Check for database readiness
until diesel migration run --locked-schema; do
  COUNTER=$((COUNTER + 1))
  if [ "$COUNTER" -ge "$RETRIES" ]; then
    echo "Exceeded maximum retries, exiting."
    exit 1
  fi

  echo "Migrations failed, retrying in 5 seconds... (Attempt $COUNTER/$RETRIES)"
  sleep 5
done

echo "Migrations ran successfully, starting the application..."
exec cargo run --release