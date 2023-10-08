const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const db = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { promises } = require('dns');

/* auxiliary middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user; /* creates a new field in the req object on the fly*/
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

/* 1:n */
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

/* 1:1 */
User.hasOne(Cart);
Cart.belongsTo(User);

/* n:n relationship */
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

/* 1:n */
Order.belongsTo(User);
User.hasMany(Order);

/* n:n */
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

db.sync()
  .then((incoming) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'drei', email: 'test@bundina.com' });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    return user.createCart();
  })
  .then((incoming) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
