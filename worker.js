require('dotenv').config();
const sharp = require('sharp');
const axios = require('axios'); // Use axios for HTTP requests
const Product = require('./models/Product');
const imageProcessingQueue = require('./queue');
const connectDB = require('./db/main');
const fs = require('fs');
const path = require('path');

// Connect to the database
connectDB();

// Function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Worker process
const processJob = async (job) => {
  const { requestId } = job.data;

  try {
    // Fetch products for the request
    const products = await Product.find({ requestId });

    for (const product of products) {
      const outputImageUrls = [];
      for (const inputUrl of product.inputImageUrls) {
        try {
          // download image
          const imageResponse = await axios.get(inputUrl, { responseType: 'arraybuffer' });
          const imageBuffer = Buffer.from(imageResponse.data);

          // compress image
          const compressedImage = await sharp(imageBuffer)
            .jpeg({ quality: 50 })
            .toBuffer();

          const outputKey = `processed/${requestId}/${Date.now()}.jpg`;
          const outputPath = path.join(__dirname, 'output', outputKey);
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, compressedImage);

          outputImageUrls.push(outputPath);

          // Add a 5-second delay before processing the next image
          await delay(5000); // 5000 milliseconds = 5 seconds
        } catch (error) {
          console.error("Error processing image:", error);
        }
      }

      product.outputImageUrls = outputImageUrls;
      await product.save();
    }

    // publish webhook
    await axios.post('http://localhost:8000/api/worker/callback', {
        requestId,
        status: 'COMPLETED',
    });
  } catch (error) {
    await axios.post('http://localhost:8000/api/worker/callback', {
        requestId,
        status: 'FAILED',
      });
  }
};

// Start listening for jobs
imageProcessingQueue.process(processJob);

console.log("worker is running");