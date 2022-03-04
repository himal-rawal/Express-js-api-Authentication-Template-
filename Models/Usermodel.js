const mongoose= require("mongoose")
const bcrypt= require('bcrypt')

const Schema=mongoose.Schema

const UserSchema= new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type:String,
        required: true,
    }
})

// we are using save middleware in Auth_route.js
//so we will add bcrypt before firing it
UserSchema.pre('save', async function (next) {
    try {
      /* 
      Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
      */
      if (this.isNew) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
      }
      next()
    } catch (error) {
      next(error)
    }
  })

//using bcrypt for login
UserSchema.methods.isValidPassword =async function(password){
    try{
        return await bcrypt.compare(password,this.password)
    }catch(error){
        throw error
    }
}

//create user
const User=mongoose.model('user', UserSchema)
//export this mmodel
module.exports= User