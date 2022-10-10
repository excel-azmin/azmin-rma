const EventStore = require('geteventstore-promise');
const eventData = require('./event-sample.json');
const client = new EventStore.TCPClient({
  hostname: 'localhost',
  port: 1113,
  credentials: {
    username: 'admin',
    password: 'changeit',
  },
});

client
  .writeEvent(
    eventData.testStream,
    eventData.testEventPattern,
    eventData.payload,
  )
  .then(() => client.getEvents(eventData.testStream, undefined, 1, 'backward'))
  .then(events => console.info(events[0]))
  .catch(error => console.error({ error: error.message }))
  .finally(() =>
    client
      .close()
      .then(closed => console.log('Disconnected'))
      .catch(error => console.error({ error: error.message })),
  );
