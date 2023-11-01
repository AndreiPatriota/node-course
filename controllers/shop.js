const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((listofProducts) => {
      res.render('shop/product-list', {
        prods: listofProducts,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((listofProducts) => {
      res.render('shop/index', {
        prods: listofProducts,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCartItems()
    .then((listofCartItems) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        listofCartItems: listofCartItems,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.add2Cart(product);
    })
    .then((data) => {
      console.log('Product added to cart!');
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .getCartItems()
    .then((listofCartItems) => {
      const item2Delete = listofCartItems.find((cartItem) => {
        return cartItem._id.toString() === prodId.toString();
      });

      const itemIndex = listofCartItems.indexOf(item2Delete);
      const newQuantity = item2Delete.quantity - 1;
      if (newQuantity > 0) {
        /* There are still items */
        req.user.cart.items[itemIndex].quantity = newQuantity;
      } else {
        /* No items left */
        req.user.cart.items.splice(itemIndex, 1);
      }

      return req.user.save();
    })
    .then((data) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((listofOrders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: listofOrders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  /* .getOrders({ include: ['products'] })
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: listofOrders
    
    .then((listofOrders) => {
      });
    })
    .catch((err) => {
      console.log(err);
    }); */
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((data) => {
      req.user.cart = { items: [] };
      return req.user.save();
    })
    .then((data) => {
      console.log('The order has been taken!');
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};
