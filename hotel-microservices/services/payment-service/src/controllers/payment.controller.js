const paymentService = require('../services/payment.service');

async function postCreateOrder(req, res) {
  const result = await paymentService.createOrder(req.user.id, req.body);
  res.status(201).json({ success: true, ...result });
}

async function postVerify(req, res) {
  const result = await paymentService.verifyPayment(req.body);
  res.status(200).json({ success: true, ...result });
}

module.exports = { postCreateOrder, postVerify };
