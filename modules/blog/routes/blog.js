'use strict';
var blogs = require('../models/blog.model');


module.exports =  (app)=> {
    app.route('/' + process.env.VERSION + '/createblog').post(async function (req, res, next) {
        try {
            const newBlog = new blogs({
                title: req.body.title,
                type: req.body.type,
                owner: req.body.owner,
                category: req.body.category,
                content: req.body.content,
                bannerImage: req.body.bannerImage
            });
            const savedBlog = await newBlog.save();
            res.status(201).json({ 'responseCode': 200, 'bloglist': savedBlog });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    app.route('/' + process.env.VERSION + '/blogList').get(async function (req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;
        const query = req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {};
        const sortQuery = { created_at: -1 } ;
        try {
            const items = await blogs.find(query)
                .sort(sortQuery)
                .limit(limit)
                .skip(skipIndex)
                .exec();

            const totalItems = await blogs.countDocuments(query);
            const totalPages = Math.ceil(totalItems / limit);

            res.json({
                items,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Get Blog by ID
    app.get(`/${process.env.VERSION}/blogbyid/:id`, (req, res) => {
        const id = req.params.id;

        blogs.findOne({ _id: id })
            .then(blog => {
                if (blog) {
                    res.json({ success: true, data: blog });
                } else {
                    res.status(404).json({ success: false, message: "Blog not found" });
                }
            })
            .catch(err => {
                console.error("Error fetching blog:", err);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            });
    });

    // Update Blog
    app.put(`/${process.env.VERSION}/updateblog/:id`, (req, res) => {
        const id = req.params.id;
        const update = req.body;

        blogs.findByIdAndUpdate(id, update, { new: true })
            .then(blog => {
                if (blog) {
                    res.json({ success: true, message: "Blog updated successfully", data: blog });
                } else {
                    res.status(404).json({ success: false, message: "Blog not found" });
                }
            })
            .catch(err => {
                console.error("Error updating blog:", err);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            });
    });

    // Delete Blog
    app.delete(`/${process.env.VERSION}/deleteblog/:id`, (req, res) => {
        const id = req.params.id;
        blogs.findByIdAndDelete(id)
            .then(blog => {
                if (blog) {
                    res.json({ success: true, message: "Blog deleted successfully" });
                } else {
                    res.status(404).json({ success: false, message: "Blog not found" });
                }
            })
            .catch(err => {
                console.error("Error deleting blog:", err);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            });
    });






}