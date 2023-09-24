const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([listofProducts, fieldData]) => {
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
    .then(([[product], fieldInfo]) => {
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
    .then(([listofProducts, fieldData]) => {
      res.render('shop/index', {
        prods: listofProducts,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {});
};

exports.getCart = (req, res, next) => {
  let cartData;
  Cart.getCart()
    .then((fileContent) => {
      cartData = JSON.parse(fileContent);
      return Product.fetchAll();
    })
    .then(([listofProducts, fieldData]) => {
      const cartProducts = [];
      for (const product of listofProducts) {
        const cartProductData = cartData.products.find(
          (prod) => Number(prod.id) === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(([[product], fieldInfo]) => {
      Cart.addProduct(prodId, product.price);
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  let productObj;
  Product.findById(prodId)
    .then(([[product], fieldInfo]) => {
      productObj = product;

      return Cart.getCart();
    })
    .then((fileContent) => {
      const cartObj = JSON.parse(fileContent);


    })
    .catch((err) => {
      console.log(err);
    });
  /* Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  }); */
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
