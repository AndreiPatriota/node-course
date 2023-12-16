const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  if (req.session.user) {
    console.log('Tá logado, Carai!');
  } else {
    console.log('estou seguindo....a gsuis cristo!');
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (password === 'bundinha' && email === 'bundinha@linda.com') {
    User.find({ email: 'bundinha@linda.com' })
      .populate('cart.items.productId')
      .then((listofUsers) => {
        req.session.userId = listofUsers[0]._id;
        req.session.isLoggedIn = true;
        return req.session.save((err) => {
          if (err) {
            console.log(err);
          }
          res.redirect('/');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/');
  }

  // console.log(`The user e-mail is ${email}, and the password is ${password}`);
  /* here goes the authenticaion part I suppose */
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
