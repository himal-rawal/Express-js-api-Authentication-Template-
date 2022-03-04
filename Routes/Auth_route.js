const express= require("express")
require('@hapi/joi')
const req = require("express/lib/request")
const res = require("express/lib/response")
const createError = require("http-errors")
const  router = express.Router()
const {authschema}= require('../Helpers/validation_schema')
const User = require("../Models/Usermodel")
const{signAcessToken, signRefreshToken ,verifyRefreshToken}=require('../Helpers/jwt_helpers')
const { is } = require("express/lib/request")
const { verify } = require("jsonwebtoken")
const RefreshTokenModel = require("../Models/RefreshTokenModel")


//register route
router.post('/register',async (req,res,next)=>{
    try{
        const result= await authschema.validateAsync(req.body)
        console.log(result)
        //check if the email exist
        const doesExist= await User.findOne({email: result.email})
        if(doesExist){
            throw createError.Conflict(`${result.email} has already been registered`)
        }
        const user= new User(result)
        const saveduser=await user.save()
        //res.send(saveduser)
        //create acess client token from userid of saveduser
        const acessToken= await signAcessToken(saveduser.id)
        const refreshToken= await signRefreshToken(saveduser.id)
        res.send({acessToken,refreshToken})
    }
    catch(error){
        if(error.isJoi === true) error.status=422
        console.log(error)
        next(error)
    }
})
//login route
router.post('/login',async (req,res,next)=>{
    try{
        const result= await authschema.validateAsync(req.body)
        // check if email exist
        const user= await User.findOne({email:result.email})
        if(!user){
            throw createError.BadRequest("Invalid username/password")
        }

        //check if password match
        const ismatch=await user.isValidPassword(result.password)
        if (!ismatch){
            throw createError.Unauthorized("Invalid username/password")
        }

        const acesstoken= await signAcessToken(user.id)
        const refreshToken= await signRefreshToken(user.id)
        res.send({acesstoken,refreshToken})

    }catch(error){
        if (error.isJoi === true){
            return next(createError.BadRequest("Invalid username/password"))
        }
        next(error)
    }
})
//refresh token route
router.post('/refresh-token',async (req,res,next)=>{
    try {
        const {refreshToken}=req.body
        if (!refreshToken){
            throw createError.BadRequest()
        }
        const userId=await verifyRefreshToken(refreshToken)
        const acessToken=await signAcessToken(userId)
        const refToken= await signRefreshToken(userId)
        
        res.send({acessToken:acessToken,refreshToken:refToken})

    } catch (error) {
        next(error)
    }
})
//logout route
router.delete('/logout',async (req,res,next)=>{
    try{
        const {refreshToken}=req.body
        if(!refreshToken) throw createError.BadRequest
        const userId = await verifyRefreshToken(refreshToken)
        RefreshTokenModel.findOneAndDelete({'user':userId},(err, doc)=> {
            if(err){
               throw createError.InternalServerError()
            }
            //console.log(doc)
            res.sendStatus(204)
        });
    }catch(error){
        next(error)
    }
})

module.exports=router