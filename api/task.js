var app = require("express");
var router = app.Router();
var Task = require("../models/task");
var User = require("../models/user");
var Category = require("../models/category");

// Devolver todos los Task
router.get("/task", function(req, res) {
    Task.find(function(err, task) {
        User.populate(task, {
            path: "user"
        }, function(err, task) {
            Category.populate(task, {
                path: "category"
            }, function(err, task) {
                res.status(200).send(task);
            });
        });
    });
});

// Crea un Task
router.post("/task", function(req, res) {
    var task = new Task(req.body);
    task.save(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});
//delete a Task
router.post("/task/delete/:_id", function(req, res) {
    Task.findByIdAndRemove(req.params._id, function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});
//update a Task
router.post("/task/update/:_id", function(req, res) {
    Task.findById(req.params._id, function(err, Task) {
        if (err) {
            res.status(500).send(err);
        } else {
            Task.date = req.body.date || Task.date;
            Task.startDate = req.body.startDate || Task.startDate;
            Task.endDate = req.body.endDate || Task.endDate;
            Task.user = req.body.user || Task.user;
            Task.category = req.body.category || Task.category;
            Task.title = req.body.title || Task.title;
            Task.detail = req.body.detail || Task.detail;
            Task.comment = req.body.comment || Task.comment;
            Task.state = req.body.state || Task.state;
            Task.save(function(err, Task) {
                if (err) {
                    res.status(500).send(err)
                }
                res.send(Task);
            });
        }
    });
});

module.exports = router;
