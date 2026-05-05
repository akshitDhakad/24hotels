const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const authController = require('../controllers/auth.controller');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require('../schemas/auth.schemas');

const router = express.Router();

router.post('/register', validateRequest(registerSchema), asyncWrapper(authController.postRegister));
router.post('/login', validateRequest(loginSchema), asyncWrapper(authController.postLogin));
router.post('/logout', asyncWrapper(authController.postLogout));
router.post('/refresh', asyncWrapper(authController.postRefresh));
router.post('/forgot-password', validateRequest(forgotPasswordSchema), asyncWrapper(authController.postForgotPassword));
router.post('/reset-password', validateRequest(resetPasswordSchema), asyncWrapper(authController.postResetPassword));

router.get('/me', requireAuth(), asyncWrapper(authController.getMe));
router.put('/profile', requireAuth(), validateRequest(updateProfileSchema), asyncWrapper(authController.putProfile));
router.put('/password', requireAuth(), validateRequest(changePasswordSchema), asyncWrapper(authController.putPassword));

module.exports = router;
