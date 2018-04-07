var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Order = require('../models/order');
var Report = require('../models/report');
var AuctionProduct = require('../models/auction-product');

var Product = require('../models/product');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find( function(err,docs){
    var productChunks = [];
    var chunkSize = 4;
    for(var i =0;i <docs.length;i+=chunkSize){
      productChunks.push(docs.slice(i,i+chunkSize));
    }
    AuctionProduct.find( function(err,results){
      var auctionProductChunks = [];
      for(var i =0;i <results.length;i+=chunkSize){
        auctionProductChunks.push(results.slice(i,i+chunkSize));
      }
      res.render('shop/index', { title: 'TAK.tik.TUK',products: productChunks, auctionProducts:auctionProductChunks, successMsg:successMsg, noMessages:!successMsg});
    });
  });
});

router.post('/report-ad/:id',function(req,res,next){
  new Report({
    productId:req.params.id,
    reason:req.body.reason,
    email:req.body.email,
    message:req.body.message
  }).save(function(err,result){
    req.flash('success','Your report has been sent successfully!');
    res.redirect('/');
  });
});

router.post('/bid/:id',isLoggedIn,function(req,res,next){
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  var currentdate = new Date();
  var datetime = currentdate.getDate()
                +" "
                + monthNames[currentdate.getMonth()]
                +" "
                + currentdate.getFullYear()
                + " "
                + currentdate.timeNow();
  AuctionProduct.findOneAndUpdate({_id:req.params.id},
    {$inc:{bids:1}},
    {returnOriginal:false}).then((result)=>{console.log(result);});
  AuctionProduct.update({ _id: req.params.id },
    {$push:{bidders:{bidder:req.user.email, bid:req.body.bid, time:datetime}}}).then((result)=>{console.log(result);});
    req.flash('success','Bidding is success!');
    res.redirect('/');

});


router.get('/sell',function(req, res, next){
    res.render('shop/sell');
});

router.get('/auction',function(req, res, next){
    res.render('shop/auction');
});

//++date time format
Date.prototype.timeNow = function(){
  return ((this.getHours() < 10)?"0":"")
  + ((this.getHours()>12)?(this.getHours()-12):this.getHours()) +":"
  + ((this.getMinutes() < 10)?"0":"") + this.getMinutes()
  +" "
  + ((this.getHours()>12)?('PM'):'AM');
}
//--date time format


router.post('/post-item',function(req,res,next){
  var imagePath = req.body.imagepath;
  var title = req.body.name;
  var description = req.body.description;
  var price = req.body.price;
  var seller = req.user;
  var category = req.body.category;

  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  var currentdate = new Date();
  var datetime = currentdate.getDate()
                +" "
                + monthNames[currentdate.getMonth()]
                +" "
                + currentdate.getFullYear()
                + " "
                + currentdate.timeNow();

  //mongoose.connect('localhost:27017/shopping');
  new Product({
    seller:seller,
    category: category,
    imagePath: imagePath,
    title: title,
    description: description,
    price: price,
    datetime: datetime
  }).save(function(err,result){
    console.log(result);
    req.flash('success','Item has been successfully posted! It will be appeared here shortly!');
    res.redirect('/');
  });

  //mongoose.disconnect();
});

router.post('/post-auction-item',function(req,res,next){
  var imagePath = req.body.imagepath;
  var title = req.body.name;
  var description = req.body.description;
  var price = req.body.price;
  var seller = req.user;
  var category = req.body.category;
  var days = req.body.days;


  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  var currentdate = new Date();
  var datetime = currentdate.getDate()
                +" "
                + monthNames[currentdate.getMonth()]
                +" "
                + currentdate.getFullYear()
                + " "
                + currentdate.timeNow();

  new AuctionProduct({
    seller:seller,
    category: category,
    imagePath: imagePath,
    title: title,
    description: description,
    price: price,
    datetime: datetime,
    days:days,
    bids:0
  }).save(function(err,result){
    if(err){
      console.log(err);
      req.flash('error',err);
      res.redirect('/');
    }
    console.log(result);
    req.flash('success','Item has been successfully posted! It will be appeared here shortly!');
    res.redirect('/');
  });
});

router.get('/product-view/:id',function(req, res,next){
  var productId = req.params.id;
  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    res.render('shop/product-view',{product:product});
  });
});

router.get('/auction-product-view/:id',function(req, res,next){
  var productId = req.params.id;
  AuctionProduct.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    res.render('shop/auction-product-view',{product:product});
  });
});

router.get('/add-to-cart/:id',function(req, res, next){
  var productId = req.params.id;
  var cart  = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product,product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
      return res.redirect('/shopping-cart');
  });
});

router.get('/reduce/:id',function(req,res,next){
  var productId = req.params.id;
  var cart  = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id',function(req,res,next){
  var productId = req.params.id;
  var cart  = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart',function(req,res,next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout',{ total: cart.totalPrice, errMsg: errMsg, noError: !errMsg })
});

router.post('/checkout',isLoggedIn,function(req, res, next){
    if(!req.session.cart){
      return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
      "sk_test_vaNBgRZQxOYLfAvTXVkIdUnI"
    );

    stripe.charges.create({
      amount: cart.totalPrice,//req.session.cart - ARS-06-22-2017
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Test Charge"
    }, function(err, charge) {
      if(err){
        req.flash('error',err.message);
        return res.redirect('/checkout');
      }
      var order = new Order({
        user:req.user,
        cart:cart,
        address:req.body.address,
        name:req.body.name,
        paymentId:charge.id
      });
      order.save(function(err,result){
        req.flash('success','Successfully purchased! Item(s) will be delivered!');
        req.session.cart = null;
        res.redirect('/');
      });

    });
});

router.get('/bid-history/:id',function(req,res,next){
  var productId = req.params.id;
  AuctionProduct.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    res.render('shop/bid-history',{bidHistory:product.bidders});
  });
});


module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
