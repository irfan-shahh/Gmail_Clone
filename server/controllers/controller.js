
const nodemailer=require('nodemailer')
const Email=require('../model/email')
const streamifier=require('streamifier')
const cloudinary=require('../cloudinary_config')
const { json } = require('express')


require('dotenv').config()

const uploadToCloudinary=(fileBuffer,originalName,mimetype)=>{
    return new Promise((resolve,reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream({
            resource_type:'auto',
            folder:'email_attachments',
            public_id:`attachment_${Date.now()}`,
            context:{
                original_filename:originalName
            }
        },(error,result)=>{
            if(error){
                console.log('cloudinary upload error',error)
                reject(error)
            }
            else{
                resolve({
                    cloudinaryUrl:result.secure_url,
                    cloudinaryPublicId:result.public_id
                })
            }
        })
        streamifier.createReadStream(fileBuffer).pipe(uploadStream)

    })
}
 const deleteFromCloudinary= async (publicId)=>{
          try{
              const result=  await cloudinary.uploader.destroy(publicId)
              return result
          }catch(error){
            console.log('error while deleting the files from cloudinary',error)
          }
 }


const sendEmail= async(req,res)=>{
    
    const{to,subject,body,from,date,image,name,starred,type}=req.body
    const files=req.files || []

    const cloudinaryUploads=await Promise.all(
        files.map(async(file)=>{
            const cloudinaryData=await uploadToCloudinary(file.buffer,file.originalname,file.mimetype)
            return {
                filename:file.originalname,
                originalName:file.originalname,
                size:file.size,
                mimetype:file.mimetype,
                cloudinaryUrl:cloudinaryData.cloudinaryUrl,
                cloudinaryPublicId:cloudinaryData.cloudinaryPublicId
            }
        })
    )
    try{
        const transporter=nodemailer.createTransport({
            host:'smtp.sendgrid.net',
            port:587,
            auth:{
                user:'apikey',
                pass:process.env.SENDGRID_API_KEY
            }
        });
       const mailOptions={
        from:process.env.FROM_EMAIL,
        to,
        subject,
        text:body,
       }
       if(files && files.length>0){
        mailOptions.attachments=files.map((file)=>({
            filename:file.originalname,
            content:file.buffer,
            contentType:file.mimetype

        }))
       }
      const result=await transporter.sendMail(mailOptions)

      const emailPayload={
        
           to,
            from,
            subject,
            body,
            date: new Date(date),  
            name,
            starred:false,  
            type,
            bin: false,
            attachments:cloudinaryUploads
      } 
      await Email.create(emailPayload)
      res.status(200).json({message:'email sent successfully',result})
    }catch(error){
    console.log('error while sending the  mail' ,error)
    res.status(500).json({ message: 'Failed to send email', error });
    }

}

const saveSentEmails=async(req,res)=>{
    try{
       const email=await Email.create(req.body)
       res.status(200).json({msg:'message saved successfully',email})
    }
    catch(error){
        res.status(500).json({msg:error.message})
    }

}

const getEmails= async (req,res)=>{
    let emails;
    try{
        if(req.params.type==='bin'){
           emails= await Email.find({bin:true})
        }
       else if(req.params.type==='allmail'){
           emails= await Email.find({})
        }

        else if(req.params.type==='starred'){

            emails= await Email.find({starred:true,bin:false})
        }
        
        else {
             emails=await Email.find({type:req.params.type})
        }
       
        return res.status(200).json(emails)

    }
    catch (error){
    res.status(500).json({msg:error.message})
    }

}
const deleteEmails= async(req,res)=>{
    try{
        //delete the emails from cloudinary
        const emailsToDelete=await Email.find({_id:{$in:req.body}})
         for(const email of emailsToDelete){
            if(email.attachments && email.attachments.length>0){
                for(const attachment of email.attachments){
                    if(attachment.cloudinaryPublicId){
                        await deleteFromCloudinary(attachment.cloudinaryPublicId)
                    }
                }
            }
         }

       await Email.deleteMany({_id:{$in:req.body}})
        res.status(200).json('emails deleted successfully');
    }
     catch (error){
    res.status(500).json({msg:error.message})
    }

}

const moveEmailsToBin=async (req,res)=>{
try{

      await Email.updateMany({_id:{$in:req.body}},{$set:{bin:true,starred:false,type:''}})
        res.status(200).json('emails moved to bin  successfully');
    }
     catch (error){
    res.status(500).json({msg:error.message})
    }

}

const toggleStarredMails=async (req,res)=>{
    try{
        await Email.updateOne({_id:req.body.id},{$set:{starred:req.body.value}})
        res.status(201).json(' starred Value is updated');

    }
    catch(error){
        res.status(500).json({msg:error.message})
    }

}



module.exports={sendEmail,saveSentEmails,getEmails,moveEmailsToBin,deleteEmails,toggleStarredMails};