const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');
const User = require('../models/user.model');
const PasswordReset = require('../models/password-reset.model');
const { AppError } = require('../utils/AppError');
const { sendMail } = require('./mailer.service');

const BCRYPT_ROUNDS = 12;

function signAccessToken(user) {
  const env = getEnv();
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
}

function signRefreshToken(user) {
  const env = getEnv();
  return jwt.sign({ sub: user.id, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  });
}

function mapUserPublic(userDoc) {
  if (!userDoc) return null;
  const u = userDoc.toObject ? userDoc.toObject() : userDoc;
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    isVerified: u.isVerified,
    createdAt: u.createdAt,
  };
}

async function register(data) {
  if (data.role === 'admin') {
    throw new AppError(403, 'Public registration as admin is not allowed');
  }

  const emailTaken = await User.findOne({ email: data.email });
  if (emailTaken) {
    throw new AppError(409, 'Email already registered');
  }
  const phoneTaken = await User.findOne({ phone: data.phone });
  if (phoneTaken) {
    throw new AppError(409, 'Phone number already registered');
  }

  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    passwordHash,
    isVerified: false,
  });
  return mapUserPublic(user);
}

async function login(email, password) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new AppError(401, 'Invalid credentials');
  }
  const payload = { id: user._id.toString(), role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return {
    user: mapUserPublic(user),
    accessToken,
    refreshToken,
  };
}

async function refreshFromToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError(401, 'Missing refresh token');
  }
  const env = getEnv();
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }
  if (decoded.type !== 'refresh' || !decoded.sub) {
    throw new AppError(401, 'Invalid refresh token');
  }
  const user = await User.findById(decoded.sub);
  if (!user) {
    throw new AppError(401, 'Invalid refresh token');
  }
  const payload = { id: user._id.toString(), role: user.role, email: user.email };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) {
    return { message: 'If the account exists, a reset email was sent.' };
  }
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await PasswordReset.deleteMany({ userId: user._id });
  await PasswordReset.create({ userId: user._id, tokenHash, expiresAt });

  const env = getEnv();
  const baseUrl = (env.PUBLIC_APP_URL || '').replace(/\/$/, '');
  const linkLine = baseUrl
    ? `Open: ${baseUrl}/reset-password?token=${rawToken}\n\nOr paste this token in the app:\n${rawToken}`
    : `Use this token to reset your password (valid 1 hour):\n${rawToken}`;

  await sendMail({
    to: user.email,
    subject: 'Password reset',
    text: `You requested a password reset.\n\n${linkLine}`,
    html: baseUrl
      ? `<p>You requested a password reset.</p><p><a href="${baseUrl}/reset-password?token=${encodeURIComponent(
          rawToken
        )}">Reset password</a></p><p>This link expires in 1 hour.</p>`
      : `<p>Use this token to reset your password (valid 1 hour):</p><pre>${rawToken}</pre>`,
  });
  return { message: 'If the account exists, a reset email was sent.' };
}

async function resetPassword(token, newPassword) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const pr = await PasswordReset.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
  if (!pr) {
    throw new AppError(400, 'Invalid or expired token');
  }
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await User.updateOne({ _id: pr.userId }, { $set: { passwordHash } });
  await PasswordReset.deleteMany({ userId: pr.userId });
  return { message: 'Password updated' };
}

async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return mapUserPublic(user);
}

async function updateProfile(userId, data) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  if (data.phone && data.phone !== user.phone) {
    const taken = await User.findOne({ phone: data.phone, _id: { $ne: user._id } });
    if (taken) {
      throw new AppError(409, 'Phone number already in use');
    }
    user.phone = data.phone;
  }
  if (data.name !== undefined) {
    user.name = data.name;
  }
  await user.save();
  return mapUserPublic(user);
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) {
    throw new AppError(401, 'Current password is incorrect');
  }
  user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await user.save();
  return { message: 'Password updated' };
}

async function listUsersForAdmin(page, limit) {
  const skip = (page - 1) * limit;
  const filter = {};
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name email phone role isVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);
  return {
    users: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
    })),
    total,
    page,
    limit,
  };
}

async function getUserForAdmin(userId) {
  const user = await User.findById(userId).select('name email phone role isVerified createdAt').lean();
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

module.exports = {
  register,
  login,
  refreshFromToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword,
  listUsersForAdmin,
  getUserForAdmin,
};
