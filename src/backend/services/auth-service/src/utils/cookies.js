const { getEnv } = require('../config/env');

function refreshCookieBaseOptions() {
  const env = getEnv();
  const isProd = env.NODE_ENV === 'production';
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: maxAgeMs,
    path: '/',
  };
}

function setRefreshTokenCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, refreshCookieBaseOptions());
}

function clearRefreshTokenCookie(res) {
  res.clearCookie('refreshToken', { path: '/' });
}

module.exports = { setRefreshTokenCookie, clearRefreshTokenCookie };
