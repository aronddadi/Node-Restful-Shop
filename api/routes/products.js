const express = require('express');
const router = express.Router();
// Subpackage shipped with express
// Conveniently handle different routes
const multer = require('multer'); // to parse files
//storage strategy
const checkAuth= require ('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, './uploads');
    },
    filename : (req,file,cb) =>{
        cb(null,new Date().toISOString()+file.originalname);
    }
});
const fileFilter= (req,file,cb) =>{
    //reject a file
    // cb(null,false);
    //accept it
    // cb(null,true);
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const upload = multer({ 
    storage:storage,
    limits:{
        fileSize:1024 * 1024*5 //(= 5mb)
    },
    fileFilter:fileFilter
});
const Product =  require('../models/product');

router.get('/',ProductsController.products_get_all);

router.post('/',checkAuth,upload.single('productImage') , ProductsController.products_create_product);

router.get('/:productId',ProductsController.products_get_product);

router.patch('/:productId',checkAuth, ProductsController.product_update_product);

router.delete('/:productId',checkAuth, ProductsController.product_delete);

module.exports = router;