const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require("body-parser");
const app = express(); 
const dotenv = require('dotenv');
const upload = require("./config/fileUpload")
dotenv.config();

//middleware  
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//fixed Cors::::  
const cors = require('cors');
app.use(cors());   


//multer
app.use(express.static('./uploads'))


//testing Route:::
app.get(`/${process.env.VERSION}/testdata`,(req, res)=> {
    res.send("App works!!!!!"); 
 })
 
//Database config::
const db = require('./config/dbconfig').mongoURL  

//attempt to connect Profusion Database:::   
mongoose.connect(db,{ useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology:true,useFindAndModify: false })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log(err)) 

 //Routind Module Import:::
require('./routes')(app)
   
  
const port = process.env.PORT || 8000;

app.listen(port, () => { 
    console.log(`server is running at port ${port}`); 
})  
