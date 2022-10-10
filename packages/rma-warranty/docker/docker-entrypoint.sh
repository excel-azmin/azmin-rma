#!/bin/bash

## Thanks
# https://serverfault.com/a/919212
##

set -e

if [[ -z "$API_HOST" ]]; then
    export API_HOST=localhost
fi

if [[ -z "$API_PORT" ]]; then
    export API_PORT=8000
fi

envsubst '${API_HOST} ${API_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
