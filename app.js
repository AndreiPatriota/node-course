const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { URL } = require('url');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const MONGO_DB_URI =
  'mongodb+srv://dreiptrmongo:x03KanII8YLxZ1Gz@nodecourse.0jtkdd5.mongodb.net/shop?retryWrites=true&w=majority&appName=AtlasApp';
const store = new MongoDbStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
  expires: new Date(Date.now() + 30000),
});
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
  session({
    secret: 'my secret string',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

const PORT = 3000;
const SERVER_URL = new URL('/', `http://localhost:${PORT}`);
mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(PORT, () => {
      console.log(`Server running at ${SERVER_URL}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
