'use strict';
var db = require('../../../config/dbconfig');
const mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    owner: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    bannerImage: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
});
module.exports = mongoose.model('Blog', blogSchema);
