const express = require('express');
const app = express();
const morgan = require('morgan');
// Logs every request
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require ('./api/routes/user');

mongoose.connect(
    'mongodb+srv://aronzini:'+process.env.MONGO_ATLAS_PW+'@node-rest-shop-wfjjr.mongodb.net/test',
    ()=>{}  
)
.then(()=>{
    console.log("lol");
})
.catch(e=>{
    console.log(e);
});
mongoose.Promise = global.Promise;



app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); 
// with the first arguemnt you only parse requests to that path
app.use(bodyParser.urlencoded({extended :false}))
// true = accepts rich data , false only supports simple bodies for url encoded data
app.use(bodyParser.json());


app.use((req,res,next)=>{
    res.header('Acces-Control-Allow-Origin','*');
    // * gives acces to everything  you can alos limit it by saying http://myapi.com 
    res.header('Acces-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization'); 
    // You could put a * if you wana allow any headers, otherwise just the ones yu want to allow
    if(req.method==='OPTIONS') {
        res.header('Acces-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
        // Which methods you accept
        return res.status(200).json({});
    }
    // Browsers always checks options first when sending post or put request
    // Can't avoid it, is request allowed?

    next(); // without this it stops here
});

//Another middleware, appends headers to any response we send back
//funnels all requests through it

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
// Acts as a middleware
// Routes which handle requests

app.use((req,res,next)=>{
    const error= new Error('Not found');
    error.status=404;
    next(error);
});
// Handles  all requests that weren't handled by previously 


app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports =app;