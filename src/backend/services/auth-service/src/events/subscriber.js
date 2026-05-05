/**
 * Auth-service has no RabbitMQ consumers in the current design.
 */
async function initSubscriber() {
  return null;
}

module.exports = { initSubscriber };
