const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const port = 3000;
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const { connect2Mongo } = require('./util/database');
const User = require('./models/user');

/* auxiliary middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findById('6531d2d7b0e8e6da8d7a83bb')
    .then((user) => {
      req.user = new User(user.name, user.email, user._id, user.cart);
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

connect2Mongo(() => {
  app.listen(port, () => {
    console.log(`Server running at port ${port}.`);
  });
});
