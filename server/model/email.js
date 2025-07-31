

const mongoose=require('mongoose')

const EmailSchema =new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    subject: String,
    body: String,
    date: {
        type: Date,
        required: true
    },
    image: String,
    name: {
        type: String,
        required: true
    },
    starred: {
        type: Boolean,
        required: true,
        default: false
    },
    bin: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
        required: true,
    },
    attachments:[{
        filename:String,
        orginalName:String,
        size:Number,
        MimeType:String,
        cloudinaryUrl:String,
        cloudinaryPublicId:String,
        uploadedAt:{
            type:Date,
            default:Date.now
        }
    }]
})

 module.exports= mongoose.model('email', EmailSchema);

