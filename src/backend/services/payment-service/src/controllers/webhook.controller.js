const webhookService = require('../services/webhook.service');

async function postWebhook(req, res) {
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  const signature = req.get('x-razorpay-signature') || req.get('X-Razorpay-Signature');
  const result = await webhookService.processWebhook(rawBody, signature, req.correlationId);
  if (!result.ok) {
    return res.status(result.status).json({
      success: false,
      message: result.message,
      correlationId: req.correlationId,
    });
  }
  return res.status(200).json({
    success: true,
    message: result.message,
    correlationId: req.correlationId,
  });
}

module.exports = { postWebhook };
