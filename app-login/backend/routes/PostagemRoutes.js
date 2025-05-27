const express = require("express");
const router = express.Router();
const PostagemController = require("../controllers/PostagemController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
 
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Somente imagens são permitidas"));
    }
  }
});

router.get("/", authMiddleware, PostagemController.listPostagens);
router.post("/", authMiddleware, PostagemController.createPostagem);
router.put("/:id", authMiddleware, PostagemController.updatePostagem);
router.delete("/:id", authMiddleware, PostagemController.deletePostagem);
router.get("/:id", authMiddleware, PostagemController.getPostagemById);

router.post('/:id/photo', authMiddleware, upload.single('photo'), PostagemController.uploadPostagemPhoto);

module.exports = router;
