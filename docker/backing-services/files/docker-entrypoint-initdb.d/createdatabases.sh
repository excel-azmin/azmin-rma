#!/usr/bin/env bash

echo 'Creating application user(s) and db(s)'

mongo $SERVER_DB \
        --host localhost \
        --port 27017 \
        -u $MONGODB_PRIMARY_ROOT_USER \
        -p $MONGODB_ROOT_PASSWORD \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '$SERVER_USER', pwd: '$SERVER_DB_PASSWORD', roles:[{role:'dbOwner', db: '$SERVER_DB'}]});"

mongo $CACHE_DB \
        --host localhost \
        --port 27017 \
        -u $MONGODB_PRIMARY_ROOT_USER \
        -p $MONGODB_ROOT_PASSWORD \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '$CACHE_USER', pwd: '$CACHE_DB_PASSWORD', roles:[{role:'dbOwner', db: '$CACHE_DB'}]});"
