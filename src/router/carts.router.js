import { Router } from 'express'
import fs from 'fs'
import carrito from './carrito.json' assert { type: "json" }
import idGenerator from '../controllers/idgenerator.js'

const router = Router()

router.post('/', (req, res) =>{
    const id = idGenerator(carrito)
    carrito.push( { 
        id: id,
        products: []
    } )
    res.status(201).json({status: "success", message: "Cart created"})
    fs.writeFileSync('./src/router/carrito.json', JSON.stringify(carrito, null, 2))
})

router.get('/:cid', (req, res) =>{
    const { cid } = req.params
    const cart = carrito.find( cart => cart.id.toString() === cid)
    if (!cart){
        res.status(400).json({ status: "error", message: 'Cart not found'})
    } else {
        res.status(200).json({cart})
    }
})


router.post('/:cid/product/:pid', (req, res) =>{
    const { cid, pid } = req.params
    const cart = carrito.find( cart => cart.id.toString() === cid)
    const product = cart.products.find( p => p.product == pid)
    if (!cart){
        res.status(400).json({ status: "error", message: 'Cart not found'})
    } else {
        if(!product){
            cart.products.push({
                product: pid,
                quantity: 1
            })
            res.status(200).json({ status: "success", message: 'Product added'})
            fs.writeFileSync('./src/router/carrito.json', JSON.stringify(carrito, null, 2))
        } else {
            product.quantity++
            res.status(200).json({ status: "success", message: 'Quantity updated'})
            fs.writeFileSync('./src/router/carrito.json', JSON.stringify(carrito, null, 2))
        }
    }
})


export default router
