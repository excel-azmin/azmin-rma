## Prerequisites

```shell
npm i -g wait-on lerna
```

## E2E Tests

```shell
# Start ERPNext
docker-compose --project-name fb -f docker/backing-services/docker-compose-erpnext.yml up -d

# Start Backend
NODE_ENV=test lerna run start:debug --scope rma-server & wait-on http://rma.localhost:8800/api

# Start Frontend
lerna run start --scope rma-frontend & wait-on http://rma.localhost:4700/api

npm run cypress -- run

kill %1 && kill %2
```
