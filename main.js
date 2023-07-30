const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const rootPath = require('./util/path.js');
const port = 3853;

const app = express();

/* This registers a Middleware function 
meant to perform body parsing of every 
request that finds this server. This works
for bodies from form POST requests. */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootPath, 'public')));

app.get('/', (inReq, inRes, next) => {
  console.log('-------------------');
  console.log('This always runs');
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use((inReq, inRes, next) => {
  inRes.status(404).sendFile(path.join(rootPath, 'views', 'not-found.html'));
});

app.listen(port, () => {
  console.log(`Servidor na porta ${port}`);
});
