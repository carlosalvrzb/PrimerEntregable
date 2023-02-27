import  { Router } from 'express'
const router = Router()

router.get('/', ( req, res) => {
    res.render('realTimeProducts', { title: 'Real time products',})
})

export default router

