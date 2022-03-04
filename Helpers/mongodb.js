const mongoose= require('mongoose')

mongoose
.connect(process.env.mongodb_uri)
.then(()=>{
    console.log("mongodb connected")
})
.catch(err=> console.log(err.message))

mongoose.connection.on('connected', ()=>{
    console.log("Mongoose connected to db")
})

mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})

mongoose.connection.on('disconneccted', ()=>{
    console.log('mongoose is disconnected')
})

process.on('SIGINT', async ()=>{
    await mongoose.connection.close();
    process.exit(0)
})
