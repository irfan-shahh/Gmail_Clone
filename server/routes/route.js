const express=require('express')

const {sendEmail,saveSentEmails,getEmails,moveEmailsToBin,deleteEmails,toggleStarredMails}=require('../controllers/controller')
const router=express.Router()
const uploadFiles=require('../middleware/upload')

router.post('/send',uploadFiles,sendEmail)
router.post('/save',saveSentEmails)
router.post('/save-draft',saveSentEmails)
router.get('/emails/:type',getEmails)
router.post('/bin',moveEmailsToBin)
router.delete('/delete',deleteEmails)
router.post('/starred',toggleStarredMails)


module.exports=router;