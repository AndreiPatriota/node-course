const { getDb } = require('../util/database');
const { ObjectId } = require('mongodb');

const _collectionName = 'users';

class User {
  constructor(name, email, _id, cart) {
    this.user = name;
    this.email = email;
    this._id = _id;
    this.cart = cart; /* {items: []} */
  }

  save() {
    const db = getDb();

    let operationResult;
    if (!this._id) {
      operationResult = db.collection(_collectionName).insertOne(this);
    } else {
      operationResult = db.collection(_collectionName).updateOne(
        { _id: new ObjectId(this._id) },
        {
          $set: this,
        }
      );
    }

    return operationResult;
  }

  add2Cart(product) {
    const cartItemIndex = this.cart.items.findIndex((cartItem) => {
      return cartItem.productId.toString() === product._id.toString();
    });

    const oldCart = { ...this.cart };
    let updatedCart = { items: [] };
    let newQuantity = 1;
    if (cartItemIndex >= 0) {
      newQuantity = oldCart.items[cartItemIndex].quantity + 1;

      updatedCart = oldCart;
      updatedCart.items[cartItemIndex].quantity = newQuantity;
    } else {
      updatedCart.items = [
        ...oldCart.items,
        { productId: new ObjectId(product._id), quantity: newQuantity },
      ];
    }

    const db = getDb();
    return db
      .collection(_collectionName)
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  addOrder() {
    const db = getDb();

    return db
      .collection('products')
      .find()
      .toArray()
      .then((listofProducts) => {
        const pricedCart = {
          items: [
            this.cart.items.map((cartItem) => {
              const unityPrice = listofProducts.find((product) => {
                return product._id.toString() === cartItem.productId.toString();
              }).price;
              const title = listofProducts.find((product) => {
                return product._id.toString() === cartItem.productId.toString();
              }).title;
              return { ...cartItem, unityPrice: unityPrice, title: title };
            }),
          ],
        };

        let totalPrice = 0.0;
        for (let item of pricedCart.items[0]) {
          totalPrice =
            totalPrice + Number(item.unityPrice) * Number(item.quantity);
        }

        return db.collection('orders').insertOne({
          items: pricedCart.items[0],
          userId: this._id,
          totalPrice: totalPrice,
        });
      })
      .then((data) => {
        console.log('deu certo');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getOrders() {
    const db = getDb();

    return db.collection('orders').find({ userId: this._id }).toArray();
  }

  getCartItems() {
    const db = getDb();
    const listofCartProductIds = this.cart.items.map((cartItem) => {
      return cartItem.productId;
    });

    return db
      .collection('products')
      .find({ _id: { $in: listofCartProductIds } })
      .toArray()
      .then((listofProducts) => {
        const listofFetchedIds = listofProducts.map((product) => {
          return product._id.toString();
        });

        const newCartItems = this.cart.items.filter((cartItem) => {
          return listofFetchedIds.includes(cartItem.productId.toString());
        });

        this.cart.items = newCartItems;
        
        return listofProducts.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((cartItem) => {
              return cartItem.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb();
    const convertedId = new ObjectId(userId);

    return db.collection(_collectionName).findOne({ _id: convertedId });
  }
}

module.exports = User;
