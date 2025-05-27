const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const imageUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Somente imagens são permitidas"));
  }
});

router.post('/', authMiddleware, imageUpload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});

router.get('/', authMiddleware, (req, res) => {
  const files = fs.readdirSync('./uploads/');
  const images = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
  res.json(images);
});

router.delete('/:name', authMiddleware, (req, res) => {
  const filePath = path.join('./uploads/', req.params.name);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: "Imagem deletada" });
  } else {
    res.status(404).json({ error: "Imagem não encontrada" });
  }
});

module.exports = router;
