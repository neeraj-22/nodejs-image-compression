# Image Processing System with Node.js

#### <a href="https://neeraj-22.notion.site/Nodejs-Image-Compression-1ae61b78c2de80d58f1ffd59443b9cf0" target="_blank">🔗 Case Study Doc on Notion </a> :A Node.js application to process image data from CSV files asynchronously, compress images, and store the results in MongoDB.

## Problem Statement
A system to efficiently process image data from CSV files. The system should:
1. Accept a CSV file containing product names and input image URLs.
2. Validate the CSV data.
3. Asynchronously process images (compress by 50% of their original quality).
4. Store processed image data and associated product information in a database.
5. Provide a unique request ID for tracking and a webhook for notifying the client when processing is complete.

## About the Project
This Node.js project is designed to handle image processing tasks efficiently. It uses:
- **MongoDB** for storing product and image urls.
- **Bull** redis based queue for task queuing and asynchronous processing.
- **Sharp** for image compression.

The project follows a modular architecture and includes robust error handling.

---

### **Key Features**
1. **CSV Upload**:
   - Accepts a CSV file with product names and image URLs.
   - Validates the CSV format and stores the data in MongoDB.

2. **Asynchronous Image Processing**:
   - Uses Bull to process images in the background.
   - Compresses images to 50% of their original quality.

3. **Webhook Support**:
   - Sends a POST request to a webhook URL when processing is complete.

4. **Environment Variables**:
   - Configurable MongoDB and Redis connections using environment variables.

5. **Scalable Architecture**:
   - Designed to handle multiple concurrent requests and large datasets.

---

### **Routes**
The application exposes the following REST API endpoints:

| Method | Route               | Description                                      |
|--------|---------------------|--------------------------------------------------|
| POST   | `/upload`           | Upload a CSV file for processing.                |
| GET    | `/status/:requestId`| Check the status of a processing request.        |
| POST   | `/api/worker/callback` | Webhook endpoint for processing completion.   |

---

### **Checklist**

| Technical Requirements       | Implemented |
|------------------------------|----------------------------|
| <b>CSV Upload API</b>    | ✅                         |
| <b>Get Status API</b>    | ✅                         |
| <b>Webhook Support</b>              | ✅                         |
| Asynchronous Image Processing| ✅                         |
| Cloud Implementation    | ❌                         |

---

## Room for Improvement
> The application is functional, but there’s always room for improvement. Future enhancements could include:

1. **Cloud Integration**: Use cloud storage like AWS S3 for processed images and lamda functions to run workers.
2. **Rate Limiting**: Add rate limiting to prevent abuse of the API.

---

## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/neeraj-22/nodejs-image-compression.git
2. Install Dependencies
   ```bash
   npm install
3. Setup env vars in .env
   ```bash
    MONGO_HOST=
    MONGO_PORT=
    REDIS_HOST=
    REDIS_PORT=
