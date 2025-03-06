const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    requestId: { type: String, required: true },
    serialNumber: { type: String, required: true },
    productName: { type: String, required: true },
    inputImageUrls: { type: [String], required: true },
    outputImageUrls: { type: [String], default: [] },
});
  
module.exports = mongoose.model('Product', productSchema);