const paymentService = require('../services/payment.service');

async function postCreateOrder(req, res) {
  const result = await paymentService.createOrder(req.user.id, req.body);
  res.status(201).json({ success: true, ...result });
}

async function postVerify(req, res) {
  const result = await paymentService.verifyPayment(req.user.id, req.body, req.correlationId);
  res.status(200).json({ success: true, ...result });
}

async function getMyTransactions(req, res) {
  const result = await paymentService.listMyTransactions(req.user.id, req.query);
  res.status(200).json({ success: true, ...result });
}

async function getTransactionById(req, res) {
  const transaction = await paymentService.getTransactionForCustomer(req.user.id, req.params.id);
  res.status(200).json({ success: true, transaction });
}

module.exports = {
  postCreateOrder,
  postVerify,
  getMyTransactions,
  getTransactionById,
};
