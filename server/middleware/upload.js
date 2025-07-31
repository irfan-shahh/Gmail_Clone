const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        cb(null, true)
    }
})
const uploadFiles=upload.array('attachments',10)
module.exports =uploadFiles