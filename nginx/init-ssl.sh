#!/bin/bash
set -e

DOMAIN=${DOMAIN:-localhost}
EMAIL=${EMAIL:-admin@example.com}

echo "Getting certificate for $DOMAIN..."

docker compose -f docker-compose.prod.yml run --rm \
    -e DOMAIN="$DOMAIN" \
    certbot certonly --webroot \
    --webroot-path=/usr/share/nginx/html \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    --force-renewal

echo "Certificates obtained!"
