const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');

const port = 3000;
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
//const User = require('./models/user');

/* auxiliary middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findById('65482aa97d19c63184a2e4c3')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

/* main routers */
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://dreiptrmongo:x03KanII8YLxZ1Gz@nodecourse.0jtkdd5.mongodb.net/shop?retryWrites=true&w=majority&appName=AtlasApp'
  )
  .then((data) => {
    return User.findOne();
  })
  .then((user) => {
    if (!user) {
      const user = new User({
        name: 'drei',
        email: 'bundinha@linda.com',
        cart: {
          items: [],
        },
      });
      user.save();
    }
    app.listen(port, () => {
      const url = new URL('/', `http://localhost:${port}/`);
      console.log(`Server running at ${url}.`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
