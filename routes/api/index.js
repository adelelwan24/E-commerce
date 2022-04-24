const router = require('express').Router();


const userRoutes = require('./userApi')
const productRoutes = require('./productApi')
const CartRoutes = require('./cartApi')
const OrderRoutes = require('./orderApi')
const AuthRoutes = require("./auth")

router.use('/auth', AuthRoutes)
router.use('/orders' , OrderRoutes);
router.use('/carts' , CartRoutes);
router.use('/products' , productRoutes);
router.use('/users' , userRoutes);


module.exports = router;