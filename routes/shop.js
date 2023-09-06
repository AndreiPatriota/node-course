const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex); /* GET / */
router.get('/products', shopController.getProducts); /* GET /products */
router.get('/cart', shopController.getCart); /* GET /cart */
router.get('/orders', shopController.getOrders); /* GET /orders */
router.get('/checkout', shopController.getCheckout); /* GET /checkout */

module.exports = router;