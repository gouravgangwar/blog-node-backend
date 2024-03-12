'use strict';
const upload = require('../../../config/fileUpload')
const fs = require('node:fs/promises');
const path = require('path');



module.exports = (app) => {
    app.route('/' + process.env.VERSION + '/file').post(upload.single('file'), async function (req, res, next) {
        if (!req.file) {
            return res.status(400).json({ error: "No file was submitted." })
        }
        const fileId = path.parse(req.file.filename).name;
        const fileUrl = `${process.env.SERVERURL}uploads/${req.file.filename}`;
        return res.status(200).json({ 'responseCode': 200, 'fileDetails': { fileId, fileUrl } });
    })

    app.delete(`/${process.env.VERSION}/fileDelete/:fileId`, async (req, res) => {
        const fileId = req.params.fileId;
        const filePath = path.join(__dirname,"../../../uploads/", fileId + '.JPG')      
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            res.json({ 'message': 'File has been deleted.' })
        } catch (error) {
            res.status(404).json({ error: 'file not found' })
        }

    })


}