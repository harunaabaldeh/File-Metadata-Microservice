var express = require("express");
var cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

var app = express();

app.use(cors());

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Configure Multer for file uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Create the uploads directory if it doesn't exist
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve the form for file upload
app.get("/", (req, res) => {
  res.send(`
    <form action="/api/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="upfile" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Handle file upload
app.post("/api/upload", upload.single("upfile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
