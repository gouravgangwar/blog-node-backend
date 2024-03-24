'use strict';
var db = require('../../../config/dbconfig');
const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    role:{ type: String , unique : true,required:true, }, 
    created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Role', userSchema);