const RefreshTokenModel = require("../Models/RefreshTokenModel")

const InsertingRefreshToken= async (userId,token)=>{
    try{
        const find_token=await RefreshTokenModel.findOne({user:userId})
                if(!find_token){
                    const refreshtokenModel= new RefreshTokenModel({
                        tooken:token,
                        user:userId,
                    });
                    await refreshtokenModel.save();
                }else{
                    let new_token = await RefreshTokenModel.findOneAndUpdate(
                        {user:userId},
                        {tooken: token},
                        {new:true}
                        
                    )
                }
    }catch (err){
        console.log(err)
    }
    
}
const GettingRefreshToken= async (userId)=>{
    const find_refreshtoken= RefreshTokenModel.findOne({"user":userId},{"tooken":1,"_id":0}).exec();
    console.log(find_refreshtoken)
    return find_refreshtoken
}


module.exports ={InsertingRefreshToken,GettingRefreshToken}