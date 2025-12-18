#!/bin/sh
set -e

# Substitute environment variables in nginx config using sed
# PORT is provided by Cloud Run (default to 8080 for local testing)
export PORT=${PORT:-8080}
sed "s/\${PORT}/$PORT/g" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
