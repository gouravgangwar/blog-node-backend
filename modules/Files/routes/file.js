'use strict';
const upload = require('../../../config/fileUpload')
const fs = require('fs').promises
module.exports = function (app) {

    app.route('/' + process.env.VERSION + '/checkserver').get(async function (req, res, next) {
      
        try {
            res.json({ 'message': 'server run. hhhhhhhhhhh' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    app.route('/' + process.env.VERSION + '/fileUpload', upload.single('file')).post(async function (req, res, next) {
        console.log(req.file);
        if (!req.file) {
            return res.status(400).json({ error: "No file was submitted." })
        }
        const fileId = path.parse(req.file.fileName).name;
        const fileUrl = `${process.env.SERVERURL}/uploads/${req.file.filename}`;
        return res.status(200).json({ 'responseCode': 200, 'fileDetails': { fileId, fileUrl } });
    })

    app.delete(`/${process.env.VERSION}/fileDelete/:fileId`, async (req, res) => {
        const fileId = req.params.fileId;
        const filePath = path.join("./uploads", fileId)
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            res.json({ 'message': 'File has been deleted.' })
        } catch (error) {
            res.status(404).json({ error: 'file not found' })
        }

    })


}