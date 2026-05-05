const { v4: uuidv4 } = require('uuid');
const { childLogger } = require('../utils/logger');

const HEADER = 'x-correlation-id';

function correlationIdMiddleware(req, res, next) {
  const incoming = req.get(HEADER);
  const id = incoming && incoming.trim() ? incoming.trim() : uuidv4();
  req.correlationId = id;
  res.setHeader(HEADER, id);
  req.log = childLogger(id);
  next();
}

module.exports = { correlationIdMiddleware };
