'use strict';
var db = require('../../../config/dbconfig');
const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    role:{type:String, required:true},
    name:{type:String, required:true},
    email:{ type: String , unique : true,required:true, }, 
    mobile:{type:Number,required:true,unique:true},
    password:{type:String, required:true},
    created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('User', userSchema);