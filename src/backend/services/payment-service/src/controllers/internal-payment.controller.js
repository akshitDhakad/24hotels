const paymentService = require('../services/payment.service');

async function getAdminTransactions(req, res) {
  const result = await paymentService.listAllTransactionsAdmin(req.query);
  res.status(200).json({ success: true, ...result });
}

async function getAdminTransactionById(req, res) {
  const transaction = await paymentService.getTransactionAdmin(req.params.id);
  res.status(200).json({ success: true, transaction });
}

module.exports = {
  getAdminTransactions,
  getAdminTransactionById,
};
