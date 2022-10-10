# NestJS Based Resource Server

Add resource server to infrastructure

POST /setup to setup service
GET /info to get service info

Use to start app development for NestJS backend

### Guards

- Use `TokenGuard` to get cached token in `req.token`
- Use `@Roles(...roles: string[])` decorator to only allow given roles
- Use `AuthServerVerificationGuard` to accept Basic Header from `client_id` and `client_secret`

### ConnectController

- Use `/connect/v1/token_delete` endpoint to listen to deleted tokens from Authorization Server
- Use `/connect/v1/user_delete` endpoint to listen to deleted users from Authorization Server
- Both endpoints are guarded by `AuthServerVerificationGuard`

### Health checks

- available on GET /api/healthz
- ping MongoDB Connection
- ping Event Store Connection
- Add your own service

### Event Store

- Know more about Event Store eventstore.org
- Configure `ES_HOST`, `ES_USER`, `ES_PASSWORD` and `ES_STREAM` in `.env` to connect to Event Store
- `StoreEventSagaService` will observe all events and append them to event store configured stream
- Checkout `create` and `list` methods of `EventStoreAggregateService` to use client connection
- Reading events requires valid `ES_USER` and `ES_PASSWORD` variables
- `client.emit('SomethingHappenedEvent', payload)` will write event to EventStore
- `@EventPattern('SomethingHappenedEvent')` decorator will subscribe to events from Event Store
- `client.send({ cmd: 'SomethingHappenedEvent' }, payload)` will write message to EventStore
- `@MessagePattern({ cmd: 'SomethingHappenedEvent' })` decorator will respond to messages from Event Store

#### Mimic event publish for development

- Start event store, setup common stream
- run `node store-event-sample.js` to manually write sample event and check for patterns
- edit the `testStream` variable from `store-event-sample.js` as per the stream to subscribe
- edit event name and payload as per need
