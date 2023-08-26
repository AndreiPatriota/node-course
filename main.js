const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const rootPath = require('./util/path.js');
const errorController = require('./controllers/error.js');

const port = 3853;
const app = express();

/* Sets global configs in the server */
app.set('view engine', 'ejs');
app.set('views', './views');

/* This registers a Middleware function 
meant to perform body parsing of every 
request that finds this server. This works
for bodies from form POST requests. */
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootPath, 'public')));

app.get('/', (inReq, inRes, next) => {
  console.log('-------------------');
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(port, () => {
  console.log(`Servidor na porta ${port}`);
});
