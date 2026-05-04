const authService = require('../services/auth.service');

async function getAdminUsers(req, res) {
  const { page, limit } = req.query;
  const data = await authService.listUsersForAdmin(page, limit);
  res.status(200).json({ success: true, ...data });
}

module.exports = { getAdminUsers };
