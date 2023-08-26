const fs = require('fs');
const path = require('path');

const path2Data = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromData = (inCallBackFun) => {
  fs.readFile(path2Data, (error, fileContent) => {
    if (error) {
      inCallBackFun([]);
    }
    inCallBackFun(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(inTitle) {
    this.title = inTitle;
  }

  save() {
    getProductsFromData((savedProducts) => {
      savedProducts.push(this);
      fs.writeFile(path2Data, JSON.stringify(savedProducts), (error) => {
        if (error) {
          console.log(error);
        }
      });
    });
  }

  static fetchAll(inCallBackFun) {
    getProductsFromData(inCallBackFun);
  }
};
