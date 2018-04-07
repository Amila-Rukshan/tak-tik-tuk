var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  productId:{type:Schema.Types.ObjectId},
  reason:{type: String, required: true},
  email: {type: String, required: true},
  message: {type: String, required: true}
});

module.exports = mongoose.model('Report',schema);
