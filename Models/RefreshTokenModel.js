const mongoose= require("mongoose")

const RefreshTokenSchema= new mongoose.Schema({
    tooken: String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: { type: Date, expires: '365d', default: Date.now },
}
);

module.exports=mongoose.model("RefreshToken",RefreshTokenSchema)