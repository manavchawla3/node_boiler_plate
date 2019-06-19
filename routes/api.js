const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

const { auth } = require('@app/http/middlewares');

const indexController = require('@app/http/controllers/api/indexController');
// const authController = require('@app/http/controllers/api/authController');

const router = express.Router();

router.get('/', [], asyncHandler(indexController.index));

// authentication
// router.post('/auth/login', [], asyncHandler(authController.login));
// router.get('/auth/logout', [], asyncHandler(authController.logout));
// router.post('/auth/register', [], asyncHandler(authController.register));
// router.get('/auth/profile', [auth, subscription.project_usage], asyncHandler(authController.profile));
// router.post('/auth/profile', [auth], asyncHandler(authController.updateProfile));
// router.get('/auth/verify-email', [], asyncHandler(authController.verify));
// router.get('/auth/resend-verify-email-link', [auth], asyncHandler(authController.resendVerifyEmailLink));
// router.post('/auth/forgot-password', [], asyncHandler(authController.forgotPassword));
// router.get('/auth/check-reset-password-link', [], asyncHandler(authController.checkResetPasswordLink));
// router.post('/auth/reset-password', [auth], asyncHandler(authController.resetPassword));
// router.post('/auth/update-password', [auth], asyncHandler(authController.updatePassword));

// router.get(
//   '/auth/google',
//   passport.authenticate('google', {
//     scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
//   })
// );

// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login',
//   }),
//   (req, res) => {
//     res.redirect('/');
//   }
// );

// router.get(
//   '/auth/github',
//   passport.authenticate('github', {
//     scope: ['user:email'],
//   })
// );

// router.get(
//   '/auth/github/callback',
//   passport.authenticate('github', {
//     failureRedirect: '/login',
//   }),
//   authController.loginSocially
// );

// router.get(
//   '/auth/github/callback',
//   passport.authenticate('github', {
//     failureRedirect: '/login',
//   }),
//   (req, res) => {
//     res.redirect('/');
//   }
// );

module.exports = router;
