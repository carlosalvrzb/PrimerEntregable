import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import homeRouter from './router/home.router.js'
import { Server } from "socket.io"
import realTimeProductsRouter from './router/realTimeProducts.router.js'
import products from './router/products.json' assert { type: "json" }

const app = express()
const httpServer = app.listen(8080, () => console.log('Server up!'))
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use('/realTimeProducts', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', homeRouter)
app.use('/realTimeProducts', realTimeProductsRouter)

io.on('connection', socket =>{
    console.log('Nuevo cliente conectado!')
    socket.emit('productos', products)
})

