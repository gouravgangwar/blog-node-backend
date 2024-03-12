const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const fileId = uuidv4();
        const fileExtension = path.extname(file.originalname);
        const fileName = fileId + fileExtension;
        cb(null, fileName)
    },
})

const upload = multer({
    storage, limits: {
        fileSize: 1024 * 1024 * 10
    }
})

module.exports = upload