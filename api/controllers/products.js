const Product = require('../models/product');
const mongoose = require('mongoose');

// get all products
exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage') // what fields you want to select
        .exec()
        .then(docs => {
            // console.log(docs);
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                }) // map it into a new array
            }
            // if(docs.length>=0){
            res.status(200).json(response)
            // }
            // else{
            //     res.status(404).json({message:'no'})
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}
// Create a new product
exports.products_create_product = (req, res, next) => {  // single = only one file
    // before (req,res,next) you can put in as many handlers as you want which will serve as middleware before the rest is executed
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling post rekwest in products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // save is a method provided by mongoose usable on mongoose object
    // => saves it in the database
}

// Get single product
exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From database ", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3000/products'
                    }
                })
            }
            else {
                res.status(404).json({
                    message: 'no valid entry found'
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


// Update product

exports.product_update_product = (req, res, next) => {
    const id = req.params.productId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps }) // Second argument =how you want to update it
        .exec()
        .then(result => {
            // console.log(result);

            res.status(200).json({
                message: "product updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.product_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}