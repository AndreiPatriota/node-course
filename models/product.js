const { getDb } = require('../util/database');
const { ObjectId } = require('mongodb');

const _collectionName = 'products';

class Product {
  constructor(title, price, description, imageUrl, _id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = _id;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let operationResult;
    if (this._id) {
      /* upadate */
      operationResult = db.collection(_collectionName).updateOne(
        { _id: new ObjectId(this._id) },
        {
          $set: this,
        }
      );
    } else {
      /* create */
      operationResult = db.collection(_collectionName).insertOne(this);
    }
    return operationResult;
  }

  static fetchAll() {
    const db = getDb();
    return db.collection(_collectionName).find().toArray();
  }

  static findById(productId) {
    const db = getDb();
    console.log(productId);
    return db
      .collection(_collectionName)
      .find({ _id: new ObjectId(productId) })
      .next()
      .then((product) => {
        return new Product(
          product.title,
          product.price,
          product.description,
          product.imageUrl,
          product._id
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(productId) {
    const db = getDb();

    return db
      .collection(_collectionName)
      .deleteOne({ _id: new ObjectId(productId) });
  }
}

module.exports = Product;
