const { getEnv } = require('../config/env');
const notificationService = require('../services/notification.service');

function getHealth(req, res) {
  res.status(200).json({ status: 'ok', service: getEnv().SERVICE_NAME, correlationId: req.correlationId });
}

async function getMyLogs(req, res) {
  const result = await notificationService.listLogsForCurrentUser(req.user, req.query);
  res.status(200).json({ success: true, ...result });
}

async function getMyLogById(req, res) {
  const log = await notificationService.getLogForCurrentUser(req.user, req.params.id);
  res.status(200).json({ success: true, log });
}

async function getAdminLogs(req, res) {
  const result = await notificationService.listLogsAdmin(req.query);
  res.status(200).json({ success: true, ...result });
}

async function getAdminLogById(req, res) {
  const log = await notificationService.getLogAdmin(req.params.id);
  res.status(200).json({ success: true, log });
}

module.exports = {
  getHealth,
  getMyLogs,
  getMyLogById,
  getAdminLogs,
  getAdminLogById,
};
