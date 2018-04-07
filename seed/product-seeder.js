var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
    imagePath:'https://images-na.ssl-images-amazon.com/images/I/41uVZlTqQnL._AC_UL320_SR250,320_.jpg',
    title:'Object-oriented Analysis and Design with the Unified Process',
    description:'Third Edition by John Satzinger, Robert Jackson and Stephen Burd, the authors have recreated this object-oriented text for anyone.',
    price:2030
  }),
  new Product({
    imagePath:'http://ecx.images-amazon.com/images/I/71P1AC10DJL._SX258_BO1,204,203,200_.gif',
    title:'Beginning OOA&D',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    price:3000
  }),
  new Product({
    imagePath:'http://pl.csie.ntut.edu.tw/~ctchen/images/analysis-patterns.jpg',
    title:'Analysis Pattens Reusable Object Models',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    price:2700
  }),
  new Product({
    imagePath:'https://images-na.ssl-images-amazon.com/images/I/51gVLEtrCNL._SX398_BO1,204,203,200_.jpg',
    title:'APPLYING UML AND PATTERNS',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    price:1999
  }),
  new Product({
    imagePath:'https://images-na.ssl-images-amazon.com/images/I/51SC4A01BQL.jpg',
    title:'Object-oriented System Analysis and Design',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    price:3670
  }),
  new Product({
    imagePath:'https://images-na.ssl-images-amazon.com/images/I/51-uo4HUPCL._SX375_BO1,204,203,200_.jpg',
    title:'Object-oriented Analysis and Design with Applications',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    price:1700
  })
];
var done= 0;
for(var i = 0; i <products.length;i++){
  products[i].save(function(err,result){
    done++;
    if(done === products.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
