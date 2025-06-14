#!/bin/bash

# Read environment variables or use defaults
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_NAME=${DB_NAME:-grandelitepayrollsystem}
DB_USER=${DB_USER:-test}
DB_PASS=${DB_PASS:-test}

# Optional: Echo to confirm
echo "Connecting to DB at $DB_HOST:$DB_PORT/$DB_NAME"

# Run Spring Boot app with env vars
java -jar ./dist/grand-elite-payroll-system.jar \
  --spring.datasource.url=jdbc:mysql://$DB_HOST:$DB_PORT/$DB_NAME \
  --spring.datasource.username=$DB_USER \
  --spring.datasource.password=$DB_PASS

