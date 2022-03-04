const joi=require('@hapi/joi')

const authschema=joi.object({
    email:joi.string().email().required().lowercase(),
    password: joi.string().min(2).required(),
})

module.exports= {authschema}