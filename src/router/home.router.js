import express from "express"
import products from './products.json' assert { type: "json" }

const router = express.Router()

router.get('/', (req, res) =>{
    res.render('home', {
        title: 'Products',
        products
    })
})

export default router