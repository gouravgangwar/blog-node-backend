'use strict';
var roles = require('../models/role.model');


module.exports = (app) => {
    app.route('/' + process.env.VERSION + '/createRole').post(async function (req, res, next) {
        try {
            const newRole = new roles({
                role: req.body.role,
            });
            const savedRole = await newRole.save();
            res.status(201).json({ 'responseCode': 200, 'role': savedRole });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    });
    app.delete(`/${process.env.VERSION}/deleteRole/:id`, (req, res) => {
        const id = req.params.id;
        roles.findByIdAndDelete(id)
            .then(role => {
                if (role) {
                    res.json({ success: true, message: "Role deleted successfully" });
                } else {
                    res.status(404).json({ success: false, message: "Role not found" });
                }
            })
            .catch(err => {
                console.error("Error deleting role:", err);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            });
    });
    app.route('/' + process.env.VERSION + '/roleList').get(async function (req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;
        const query = req.query.search ? { role: { $regex: req.query.search, $options: 'i' } } : {};
        const sortQuery = { created_at: -1 };
        try {
            const items = await roles.find(query)
                .sort(sortQuery)
                .limit(limit)
                .skip(skipIndex)
                .exec();

            const totalItems = await roles.countDocuments(query);
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
    app.get(`/${process.env.VERSION}/rolebyid/:id`, (req, res) => {
        const id = req.params.id;

        roles.findOne({ _id: id })
            .then(role => {
                if (role) {
                    res.json({ success: true, data: role });
                } else {
                    res.status(404).json({ success: false, message: "Role not found" });
                }
            })
            .catch(err => {
                console.error("Error fetching role:", err);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            });
    });
    app.put(`/${process.env.VERSION}/updaterole/:id`, (req, res) => {
        const id = req.params.id;
        const update = req.body;

        roles.findByIdAndUpdate(id, update, { new: true })
            .then(role => {
                if (role) {
                    res.json({ success: true, message: "Role updated successfully", data: role });
                } else {
                    res.status(404).json({ success: false, message: "Role not found" });
                }
            })
            .catch(err => {
                console.error("Error updating role:", err);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            });
    });
}