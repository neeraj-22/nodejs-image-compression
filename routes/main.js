const express = require("express");
const { uploadCSV, webhookListener, getStatus } = require("../controllers/main");
const multer = require("multer")

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


//read
router.get("/status/:requestId", getStatus)

router.post("/worker/callback", webhookListener)

//UPDATE
router.post("/upload", upload.single('csv'), uploadCSV)

module.exports = router;