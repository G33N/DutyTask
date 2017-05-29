var app = require("express");
var router = app.Router();
var Category = require("../models/category");

// Devolver todos los Category
router.get("/category", function(req, res) {
  Category.find(function(err, data) {
    if (err) throw (err);
    res.json(data);
  });
});

// Crea un Category
router.post("/category", function(req, res) {
  var category = new Category(req.body);
  category.save(function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});
//delete a Category
router.post("/category/delete/:_id", function(req, res) {
  Category.findByIdAndRemove(req.params._id, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});
//update a Category
router.post("/category/update/:_id", function(req, res) {
  Category.findById(req.params._id, function(err, Category) {
    if (err) {
      res.status(500).send(err);
    } else {
      Category.time = req.body.time || Category.time;
      Category.name = req.body.name || Category.name;
      Category.save(function(err, Category) {
        if (err) {
          res.status(500).send(err)
        }
        res.send(Category);
      });
    }
  });
});

module.exports = router;
