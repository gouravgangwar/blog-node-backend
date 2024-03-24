'use strict';

module.exports = function(app){
     require('./user/routes/user')(app) 
     require('./user/routes/role')(app) 
     require('./blog/routes/blog')(app) 
     require('./Files/routes/file')(app)      
}