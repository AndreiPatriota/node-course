const Product = require('../models/product');
const Order = require('../models/orders');

exports.getProducts = (req, res, next) => {
  Product.find()
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
  const prodId = req.params.productId.toString();

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
  Product.find({})
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
    .populate('cart.items.productId')
    .then((user) => {
      const cartItems = user.cart.items.map((item) => {
        return {
          title: item.productId.title,
          quantity: item.quantity,
          _id: item.productId._id,
        };
      });

      res.render('shop/cart', {
        listofCartItems: cartItems,
        pageTitle: 'Cart',
        path: '/cart',
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
    .removeFromCart(prodId)
    .then((data) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .populate('userId', 'name -_id')
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
  // req.user.
  //   .getOrders()
  //   .then((listofOrders) => {
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const productItems = user.cart.items.map((item) => {
        return {
          productId: item.productId,
          title: item.productId.title,
          unitPrice: item.productId.price,
          quantity: item.quantity,
        };
      });

      const totalPrice = productItems.reduce((total, element) => {
        return total + element.unitPrice * element.quantity;
      }, 0.0);

      const order = new Order({
        userId: user._id,
        products: productItems,
        total: totalPrice,
      });

      return order.save();
    })
    .then((data) => {
      req.user.cart.items = [];
      return req.user.save();
    })
    .then((data) => {
      console.log('Your order has been posted!');
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};
