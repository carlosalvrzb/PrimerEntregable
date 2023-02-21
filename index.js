const exphbs = require('express-handlebars');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const hbs = exphbs.create({
  extname: '.handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// products endpoint
const productsRouter = express.Router();
const productsPath = path.join(__dirname, 'products.json');
let products = JSON.parse(fs.readFileSync(productsPath));

productsRouter
  .route('/')
  .get((req, res) => {
    res.send(products);
  });

app.use('/products', productsRouter);

// carts endpoint
const cartsRouter = express.Router();
const cartsPath = path.join(__dirname, 'carts.json');
let carts = JSON.parse(fs.readFileSync(cartsPath));

const writeToFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data));
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

const viewsRouter = express.Router();
viewsRouter.route('/').get((req, res) => {
  res.render('layouts/home', { products });
});
viewsRouter.route('/realtimeproducts').get((req, res) => {
  res.render('layouts/realTimeProducts', { products });
});
app.use('/', viewsRouter);

app.use('/carts', cartsRouter);

app.listen(port, () => {
  console.log(`E-commerce server listening at http://localhost:${port}`);
});