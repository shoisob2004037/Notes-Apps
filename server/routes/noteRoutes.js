const express = require("express")
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  deleteNoteImage,
  toggleFavorite,
  upload,
} = require("../controllers/noteController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.use(authMiddleware)

router.get("/", getNotes)
router.post("/", upload.array("images", 10), createNote)
router.get("/:id", getNoteById)
router.put("/:id", upload.array("images", 10), updateNote)
router.patch("/:id/favorite", toggleFavorite)
router.delete("/:id", deleteNote)
router.delete("/:id/image/:imageId", deleteNoteImage)

module.exports = router
