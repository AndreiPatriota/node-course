const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'product',
        },
        quantity: { type: Number, require: true },
      },
    ],
  },
});

userSchema.methods.add2Cart = function (product) {
  const updatedCartItems = [...this.cart.items];
  const hasPrduct = this.cart.items.some((item, idx) => {
    if (item.productId.toString() === product._id.toString()) {
      updatedCartItems[idx].quantity += 1;
      return true;
    }
    return false;
  });

  if (!hasPrduct) {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.removeFromCart = function (prodId) {
  const updatedCartItems = [...this.cart.items];

  this.cart.items.some((item, idx) => {
    if (item.productId.toString() === prodId.toString()) {
      if (item.quantity > 1) {
        updatedCartItems[idx].quantity -= 1;
      } else {
        updatedCartItems.splice(idx, 1);
      }

      return true;
    }
    return false;
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = model('user', userSchema);
