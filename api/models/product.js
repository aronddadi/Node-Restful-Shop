const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // Special type, serial id = long string
    name: {type:String, required:true},
    price: {type: Number, required:true}, // Makes sure you HAVE to fill it in
    productImage : {type:String, required:true} 
});

module.exports = mongoose.model('Product',productSchema);

