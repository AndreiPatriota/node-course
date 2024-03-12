const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const listofErrMessages = errors.array().map((error) => {
      return `${error.path}: ${error.msg}\n`;
    });

    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: listofErrMessages.concat(''),
    });
  }

  req.session.isLoggedIn = true;
  return req.session.save((err) => {
    console.log(err);
    res.redirect('/');
  });
  // User.findOne({ email: email })
  //   .then((user) => {
  //     if (!user) {
  //       req.flash('error', 'Invalid email or password.');
  //       return res.redirect('/login');
  //     }
  //     bcrypt
  //       .compare(password, user.password)
  //       .then((doMatch) => {
  //         if (doMatch) {
  //           req.session.isLoggedIn = true;
  //           req.session.user = user;
  //           return req.session.save((err) => {
  //             console.log(err);
  //             res.redirect('/');
  //           });
  //         }
  //         req.flash('error', 'Invalid email or password.');
  //         res.redirect('/login');
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         res.redirect('/login');
  //       });
  //   })
  //   .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const listofErrMessages = errors.array().map((error) => {
      return `${error.path}: ${error.msg}\n`;
    });
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: listofErrMessages.concat(''),
    });
  }
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'andrei_patriota@hotmail.com',
        subject: 'Signup succeeded!',
        html: '<h1>You have just signed up!</h1>',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  // console.log(`BUNDINHAHAHAHHAHHA ${email}`);

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Not able reset the password now!');
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'There is no such user!');
          return res.redirect('reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/');
        transporter.sendMail({
          to: email,
          from: 'andrei_patriota@hotmail.com',
          subject: 'Password reset!',
          html: `
            <p>You have requested a password reset.</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return;
      }

      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let fecthedUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      fecthedUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      fecthedUser.password = hashedPassword;
      fecthedUser.resetToken = undefined;
      fecthedUser.resetTokenExpiration = undefined;
      return fecthedUser.save();
    })
    .then((data) => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });
};
