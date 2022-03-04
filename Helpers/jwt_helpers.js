const JWT = require("jsonwebtoken");
const createError= require('http-errors');
const { promise, reject } = require("bcrypt/promises");
//const { token } = require("morgan");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { token } = require("morgan");
const { InsertingRefreshToken ,GettingRefreshToken } = require("./storing_refresh");
const RefreshTokenModel = require("../Models/RefreshTokenModel")



module.exports={
    signAcessToken:(userId) => {
        return new Promise((resolve,reject) => {
            const payload={}
            const secret=process.env.Acess_Token_Secret
            const options={
                expiresIn:"1h",
                issuer:"social.com",
                audience:userId,
            }
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err) {
                    console.log(err.message)
                    reject (createError.InternalServerError())

                }
                resolve(token)
            })
        })
    },
    //middleware for veryfying token
    verifyAcessToken:(req,res,next)=>{
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader=req.headers['authorization']
        const bearerToken=authHeader.split(' ')
        const token= bearerToken[1]
        JWT.verify(token,process.env.Acess_Token_Secret, (err,payload)=>{
            if(err){
                if(err.name=== 'JsonWebTokenError'){
                    return next(createError.Unauthorized())
                }else{
                    return next(createError.Unauthorized(err.message))
                }
                
            }
            req.payload=payload
            next()

        })
    },

    signRefreshToken:(userId) => {
        return new Promise((resolve,reject) => {
            const payload={}
            const secret=process.env.Refresh_Token_Secret
            const options={
                expiresIn:"1y",
                issuer:"social.com",
                audience:userId,
            }
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err) {
                    console.log(err.message)
                    reject (createError.InternalServerError())
                }
                InsertingRefreshToken(userId,token)
                resolve(token)
            })
        })
    },
    
    verifyRefreshToken:(refreshToken) =>{
        return new Promise((resolve,reject)=>{
            JWT.verify(refreshToken,process.env.Refresh_Token_Secret,(err,payload)=>{
                if(err)return reject(createError.Unauthorized())
                const userId=payload.aud
               /**  const find_refreshtoken= RefreshTokenModel.findOne({"user":userId},{"tooken":1,"_id":0}).exec();
                console.log(find_refreshtoken);
                if(!find_refreshtoken){
                    reject(createError.InternalServerError())
                    return
                }
                if(find_refreshtoken === refreshToken){
                    console.log(find_refreshtoken);
                    return resolve(userId)
                }else{reject(createError.Unauthorized())} */
                RefreshTokenModel.find({"user":userId},{"tooken":1,"_id":0},(err, result)=> {
                    if (err){
                        reject(createError.InternalServerError())
                        return
                    }
                    const tookens = result.map(({ tooken }) => tooken);
                    //console.log(tookens)
                    if(refreshToken === tookens[0]) return resolve(userId)
                    reject(createError.Unauthorized())
                });                
                //resolve(userId)
            })
        })
    }
}