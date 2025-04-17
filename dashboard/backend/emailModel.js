const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  emailId: String,
  threadId: String,
  from: String,
  subject: String,
  receivedAt: Date,
  processedAt: Date,
  category: String,
  priority: String,
  actions: [{
    type: String,
    details: Object,
    success: Boolean
  }],
  followUpNeeded: Boolean,
  followUpDate: Date
});

module.exports = mongoose.model('Email', EmailSchema);
