const express= require("express")
const morgan= require("morgan")
const createrrors= require("http-errors")
const req = require("express/lib/request")
const res = require("express/lib/response")
require("dotenv").config()
require('./Helpers/mongodb')
var cors = require('cors')

//import middleware for acess token verification
const {verifyAcessToken}= require('./Helpers/jwt_helpers')
//import auth route
const AuthRoute= require("./Routes/Auth_route")


//initialize app
const app=express()

//using morgan to log req in console
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
/**cors 
app.use((req,res,next)=>{
    res.header("Acess-Control-Allow-Origin", "*");
    res.header("Acess-Control-Allow-Headers" , "*");
    res.header("Access-Control-Allow-Credentials", 'true

    if(req.method==='OPTIONS'){
        res.header("Acess-Control-Allow-Methods",'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})
 **/

//handling cors error
var corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  }

  app.use(cors(corsOptions))
//test route to testjwt authorization
app.get("/",verifyAcessToken, async (req,res,next)=>{
    res.send("Protected route") 
})

// create auth route
app.use('/auth', AuthRoute)

//handling 404 error this part is initialized when requested route is not found
app.use(async (req,res, next) =>{
    //const error= new Error("Not found")
    //error.status=404
    //next(error) 
    //or we can simply do
    next(createrrors.NotFound())
})

app.use((err,req,res,next) =>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message,
        },
    })
})

//start appication
const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`server  is running in port ${PORT}`) //used double bactick for wring javascript
})
