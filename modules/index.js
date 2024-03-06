'use strict';

module.exports = function(app){
     require('./blog/routes/blog')(app) 
     require('./Files/routes/file')(app)      
}