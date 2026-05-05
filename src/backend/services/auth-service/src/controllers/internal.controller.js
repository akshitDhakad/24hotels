const authService = require('../services/auth.service');

async function getAdminUsers(req, res) {
  const { page, limit } = req.query;
  const data = await authService.listUsersForAdmin(page, limit);
  res.status(200).json({ success: true, ...data });
}

async function getAdminUserById(req, res) {
  const user = await authService.getUserForAdmin(req.params.id);
  res.status(200).json({ success: true, user });
}

module.exports = { getAdminUsers, getAdminUserById };
