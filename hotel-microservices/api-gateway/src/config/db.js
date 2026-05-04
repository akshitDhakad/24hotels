/**
 * api-gateway has no database connection per architecture.
 */
async function connectDb() {
  return Promise.resolve();
}

module.exports = { connectDb };
