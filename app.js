const express = require("express");
const axios = require('axios');
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const errorMiddleware = require("./middleware/error");

// Route Imports
const projectRoutes = require("./routes/main.js");
const connectDB = require("./db/main.js");

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB()

//Interfacing Routes and APIs
app.use("/api", projectRoutes);

// Middleware for Errors
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

//Initializing Server
const server = app.listen(port, (req, res) => {
  console.log(`Server is working on http://localhost:${port}`);
});


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => { 
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
