/**
 * Auth-service does not publish to RabbitMQ in the current event matrix.
 * Stub keeps the required folder layout consistent across services.
 */
async function initPublisher() {
  return null;
}

async function publishEvent() {
  return false;
}

module.exports = { initPublisher, publishEvent };
