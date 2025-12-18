#!/bin/sh
set -e

# Substitute environment variables in nginx config using sed
# PORT is provided by Cloud Run (default to 8080 for local testing)
PORT=${PORT:-8080}

# Validate PORT is a number
if ! echo "$PORT" | grep -qE '^[0-9]+$'; then
    echo "Error: PORT must be a numeric value"
    exit 1
fi

sed "s/\${PORT}/$PORT/g" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
