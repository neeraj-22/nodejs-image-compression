const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const { v4: uuidv4 } = require('uuid');
const csv = require('csv-parser');
const fs = require('fs');
const File = require('../models/File');
const Product = require('../models/Product');
const imageProcessingQueue = require('../queue');

//
exports.uploadCSV = catchAsyncErrors(async (req, res) => {
  const csv = req.file;
  const requestId = uuidv4();

  // Save request to MongoDB
  const file = new File({ requestId });
  await file.save();

  // Parse CSV and save products to MongoDB
  const products = [];
  fs.createReadStream(csv.path)
    .pipe(csv())
    .on('data', (row) => {
      const product = new Product({
        requestId,
        serialNumber: row['S. No.'],
        productName: row['Product Name'],
        inputImageUrls: row['Input Image Urls'].split(','),
      });
      products.push(product);
    })
    .on('end', async () => {
      await Product.insertMany(products);

      // Enqueue request for processing
      await imageProcessingQueue.add({ requestId });

      res.json({ requestId });
    });

  
      // Delete the uploaded file after processing
      fs.unlink(csv.path, (err) => {
        if (err) {
          console.error("error deleting file:", err);
        } else {
          console.log("csv file deleted successfully:", csv.path);
        }
      });
})

exports.getStatus = catchAsyncErrors(async (req, res) => {
  const { requestId } = req.params;
  const file = await File.findOne({requestId});
  const status = file.status
  res.json({ status });
})

exports.webhookListener = catchAsyncErrors(async (req, res) => {
  const { requestId, status } = req.body;

  try {
    // Update the file status in the database
    await File.updateOne({ requestId }, { status });
    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process webhook' });
  }
})