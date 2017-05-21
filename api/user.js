var app = require("express");
var router = app.Router();
var User = require("../models/user");

// Devolver todos los User
router.get("/user", function(req, res) {
  User.find(function(err, data) {
    if (err) throw (err);
    res.json(data);
  });
});
// Devolver name by ID User
router.get("/user/:_id", function(req, res) {
  User.findById(req.params._id, function(err, data) {
    if (err) {
      res.send(err)
    }
    if (data) {
      res.send(data)
    } else {
      res.send("No User found with that ID")
    }
  });
});
// Crea un User
router.post("/user", function(req, res) {
  var user = new User(req.body);
  user.save(function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});
//delete a User
router.post("/user/delete/:_id", function(req, res) {
  User.findByIdAndRemove(req.params._id, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

module.exports = router;
