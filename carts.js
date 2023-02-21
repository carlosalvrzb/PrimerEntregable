const express = require("express");
const writeToFile = require("./writeToFile");

const carts = require("./carts.json");
const cartsPath = "./carts.json";
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const products = require("./products.json");
const productsPath = "./products.json";

const cartsRouter = express.Router();

cartsRouter.route("/").get((req, res) => {
  res.json(carts);
});

cartsRouter.route("/").post((req, res) => {
  const newCart = { id: carts.length + 1, products: [] };
  carts.push(newCart);
  writeToFile(cartsPath, carts);
  res.json(newCart);
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  socket.emit('productList', products);
  socket.on('addProduct', (product) => {
    product.id = products.length + 1;
    products.push(product);
    writeToFile(productsPath, products);
    io.emit('productList', products);
  });
  socket.on('deleteProduct', (productId) => {
    products = products.filter((product) => product.id !== productId);
    writeToFile(productsPath, products);
    io.emit('productList', products);
  });
});

cartsRouter.route("/:id").get((req, res) => {
  const cart = carts.find((c) => c.id === parseInt(req.params.id));
  if (!cart) {
    return res.status(404).send({ error: "El carrito no ha sido encontrado" });
  }
  return res.json(cart);
});

cartsRouter.route("/:id").put((req, res) => {
  const cartIndex = carts.findIndex((c) => c.id === parseInt(req.params.id));
  if (cartIndex === -1) {
    return res.status(404).send({ error: "El carrito no ha sido encontrado" });
  }
  carts[cartIndex] = { ...carts[cartIndex], ...req.body };
  writeToFile(cartsPath, carts);
  return res.json(carts[cartIndex]);
});

cartsRouter.route("/:id").delete((req, res) => {
  const cartIndex = carts.findIndex((c) => c.id === parseInt(req.params.id));
  if (cartIndex === -1) {
    return res.status(404).send({ error: "El carrito no ha sido encontrado" });
  }
  carts.splice(cartIndex, 1);
  writeToFile(cartsPath, carts);
  return res.send("El carrito ha sido eliminado");
});

module.exports = cartsRouter;
