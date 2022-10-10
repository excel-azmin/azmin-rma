#!/bin/bash

function checkEnv() {
  if [[ -z "$DB_HOST" ]]; then
    echo "DB_HOST is not set"
    exit 1
  fi
  if [[ -z "$DB_NAME" ]]; then
    echo "DB_NAME is not set"
    exit 1
  fi
  if [[ -z "$DB_USER" ]]; then
    echo "DB_USER is not set"
    exit 1
  fi
  if [[ -z "$DB_PASSWORD" ]]; then
    echo "DB_PASSWORD is not set"
    exit 1
  fi
  if [[ -z "$CACHE_DB_NAME" ]]; then
    echo "CACHE_DB_NAME is not set"
    exit 1
  fi
  if [[ -z "$CACHE_DB_PASSWORD" ]]; then
    echo "CACHE_DB_PASSWORD is not set"
    exit 1
  fi
  if [[ -z "$CACHE_DB_USER" ]]; then
    echo "CACHE_DB_USER is not set"
    exit 1
  fi
  if [[ -z "$NODE_ENV" ]]; then
    export NODE_ENV=production
  fi
}

function checkConnection() {
  echo "Connect MongoDB . . ."
  timeout 10 bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' $DB_HOST 27017
}

function configureServer() {
  if [ ! -f .env ]; then
    envsubst '${DB_HOST}
      ${DB_NAME}
      ${DB_USER}
      ${DB_PASSWORD}
      ${CACHE_DB_NAME}
      ${CACHE_DB_PASSWORD}
      ${CACHE_DB_USER}
      ${NODE_ENV}' \
      < docker/env.tmpl > .env
  fi
}
export -f configureServer

if [ "$1" = 'rollback' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server
  su arcapps -c "bash -c configureServer"
  # Rollback Migrations
  echo "Rollback migrations"
  # su arcapps -c "./node_modules/.bin/migrate down updateRoleScopeUuid -d mongodb://$DB_HOST:27017/$DB_NAME"
fi

if [ "$1" = 'start' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server
  su arcapps -c "bash -c configureServer"
  # Run Migrations
  echo "Run migrations"
  # su arcapps -c "./node_modules/.bin/migrate up -d mongodb://$DB_HOST:27017/$DB_NAME"

  su arcapps -c "node dist/main.js"
fi

exec runuser -u arcapps "$@"
