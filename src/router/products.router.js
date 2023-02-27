import  { Router } from 'express'
import fs from 'fs'
import products from './products.json' assert { type: "json" }
import idGenerator from '../controllers/idgenerator.js'

const router = Router()

router.get('/', (req, res) =>{
    let limit = req.query.limit
    if (!limit){
        res.status(200).json({ products }) 
    } else if (isNaN(limit)){
        res.status(400).json({ status: "error", message: "Para realizar una búsqueda con límite debe ingresar un número." })
    } else {
        let productsFilter = products.slice(0, limit)
        res.status(200).json({ products : productsFilter })
    }
})

router.get('/:pid', (req, res) =>{
    const { pid } = req.params
    const product = products.find( product => product.id.toString() === pid)
    if (!product){
        res.status(400).json({ status: "error", message: 'Product not found'})
    } else {
        res.status(200).json( product )
    }
})

router.post('/', (req, res) =>{
    const id = idGenerator(products)
    if( !req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category ){
        res.status(400).json({ status: "error", message: 'Product not complete'})
    }else if (products.find(e => e.code === req.body.code)){
        res.status(400).json({ status: "error", message: 'Code not available'})
    }else{
        req.body.id = id
        products.push( req.body )
        res.status(201).json({status: "success", message: "Product created"})
        fs.writeFileSync('./src/router/products.json', JSON.stringify(products, null, 2))
    }
})

router.put('/:pid', (req, res) =>{
    const { pid } = req.params
    const idProduct = products.findIndex( p => p.id == pid)
    if ( idProduct < 0 ){
        res.status(400).json({ status: "error", message: "Product not found"})
    } else if( !req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category ){
        res.status(400).json({ status: "error", message: 'Product not complete'})
    } else {
        req.body.id = parseInt(pid)
        products[idProduct] = req.body
        res.status(200).json({ status: "success", message: "Product updated" })
        fs.writeFileSync('./src/router/products.json', JSON.stringify(products, null, 2))
    }
})

router.delete('/:pid', (req, res) =>{
    const { pid } = req.params
    const product = products.find( product => product.id.toString() === pid)
    if( product === undefined ){
        res.status(400).json({ status: "error", message: "Product not found"})
    } else{
        const productIndex = products.indexOf(product)
        products.splice(productIndex, 1)
        res.status(200).json({ status: "success", message: "Product deleted" })
        fs.writeFileSync('./src/router/products.json', JSON.stringify(products, null, 2))
    }
})

export default router