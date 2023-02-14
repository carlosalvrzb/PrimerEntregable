const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();
const port = 3000;


// products endpoint
const productsRouter = express.Router();
const productsPath = path.join(__dirname, 'products.json');
let products = [];
fs.readFile(productsPath, (err, data) => {
  if (err) throw err;
  products = JSON.parse(data);
});

productsRouter
  .route('/')
  .get((req, res) => {
    res.send(products);
  });

app.use('/products', productsRouter);

// carts endpoint
const cartsRouter = express.Router();
const cartsPath = path.join(__dirname, 'carts.json');
let carts = [];
fs.readFile(cartsPath, (err, data) => {
  if (err) throw err;
  carts = JSON.parse(data);
});

const writeToFile = (filePath, data) => {
  fs.writeFile(filePath, JSON.stringify(data), err => {
    if (err) throw err;
  });
};


cartsRouter
  .route('/')
  .post((req, res) => {
    const newCart = { id: carts.length + 1, products: [] };
    carts.push(newCart);
    writeToFile(cartsPath, carts);
    res.send(newCart);
  });


cartsRouter
  .route('/:id')
  .get((req, res) => {
    const id = parseInt(req.params.id);
    const cart = carts.find(c => c.id === id);
    res.send(cart);
  })


  .post((req, res) => {
    const id = parseInt(req.params.id);
    const cart = carts.find(c => c.id === id);
    const productId = req.body.productId;
    const product = products.find(p => p.id === productId);
    if (cart && product) {
      cart.products.push(product);
      writeToFile(cartsPath, carts);
      res.send(cart);
    } else {
      res.status(400).send({ error: 'Carrito o producto no encontrado' });
    }
  });

app.use('/carts', cartsRouter);

app.listen(port, () => {
  console.log(`E-commerce server listening at http://localhost:${port}`);
});
