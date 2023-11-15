const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        require: true
      },
      title: {
        type: String,
        require: true,
      },
      unitPrice: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
    },
  ],
  total: {
    type: Number,
    require: true,
  },
});

module.exports = model('order', orderSchema);
