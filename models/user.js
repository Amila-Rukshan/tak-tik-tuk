var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); //to encrypt password

var userSchema = new Schema({
  //username :{type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
});

userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User',userSchema);
