const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        console.log(file);
        const fileId = uuidv4();
        const fileExtension = path.extname(file.originalname);
        const fileName = fileId + fileExtension;
        cb(null, fileName)
    },
})

const upload = multer({ storage })

module.exports = upload