var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tittle: {
    type: String,
    required: true,
    default: 'New Task'
  },
  detail: {
    type: String,
    required: true
  },
  comment: {
    type: String
  },
  state: {
    type: String,
    required: true
  }
});

var Task = mongoose.model('Task', schema);

module.exports = Task;
