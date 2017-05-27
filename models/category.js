var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    icon: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: true
    }
});

var Category = mongoose.model('Category', schema);

module.exports = Category;
