const express =require('express')
const connectDB=require('./db/connection')
const cors=require('cors')

const emailRoute=require('./routes/route')


require('dotenv').config()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())

app.use('/',emailRoute)




const port=process.env.PORT || 8000

const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is running on port ${port}`))
    }
    catch(error){
        console.log(error)
    }
}

start()