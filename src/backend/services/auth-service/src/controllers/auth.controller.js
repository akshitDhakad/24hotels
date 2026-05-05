const authService = require('../services/auth.service');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../utils/cookies');

async function postRegister(req, res) {
  const user = await authService.register(req.body);
  res.status(201).json({ success: true, user });
}

async function postLogin(req, res) {
  const { user, accessToken, refreshToken } = await authService.login(req.body.email, req.body.password);
  setRefreshTokenCookie(res, refreshToken);
  res.status(200).json({ success: true, user, accessToken, refreshToken });
}

async function postLogout(req, res) {
  clearRefreshTokenCookie(res);
  res.status(200).json({ success: true, message: 'Logged out' });
}

async function postRefresh(req, res) {
  const token = req.cookies.refreshToken;
  const { accessToken, refreshToken } = await authService.refreshFromToken(token);
  setRefreshTokenCookie(res, refreshToken);
  res.status(200).json({ success: true, accessToken });
}

async function postForgotPassword(req, res) {
  const result = await authService.forgotPassword(req.body.email);
  res.status(200).json({ success: true, ...result });
}

async function postResetPassword(req, res) {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  res.status(200).json({ success: true, ...result });
}

async function getMe(req, res) {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ success: true, user });
}

async function putProfile(req, res) {
  const user = await authService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, user });
}

async function putPassword(req, res) {
  const result = await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.status(200).json({ success: true, ...result });
}

module.exports = {
  postRegister,
  postLogin,
  postLogout,
  postRefresh,
  postForgotPassword,
  postResetPassword,
  getMe,
  putProfile,
  putPassword,
};
