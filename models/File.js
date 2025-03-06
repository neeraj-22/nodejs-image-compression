const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', fileSchema);