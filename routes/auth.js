const express = require('express');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email', 'Please, enter a valid email!').isEmail(),
    body('password')
      .isAlphanumeric()
      .isLength({ min: 1, max: 10 })
      .custom((value, { req }) => {
        return User.findOne({ email: req.body.email })
          .then((user) => {
            if (!user) {
              throw new Error('User does not exist!');
            }

            return bcrypt.compare(value, user.password).then((doMatch) => {
              if (!doMatch) {
                throw new Error('Password does not match!');
              }

              req.session.user = user;
            });
          });
      }),
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please, insert a valid email  address!')
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email is not a good choice!');
        // }
        // return true;
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              'E-mail already exists, please, pick a dfferent one!'
            );
          }
        });
      }),
    body(
      'password',
      'Please, enter an alphanumeric passwrod with at leats 5 characters but no more than 10'
    )
      .isLength({ min: 5, max: 10 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
