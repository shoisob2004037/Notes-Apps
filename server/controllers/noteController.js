const Note = require("../models/Note")
const { uploadImage, deleteImage } = require("../config/cloudinary")
const multer = require("multer")

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true)
    else cb(new Error("Only images allowed"), false)
  },
})

const createNote = async (req, res) => {
  try {
    const { title, category, content, template } = req.body
    if (!title || !category) return res.status(400).json({ message: "Title and category required" })

    const images = []
    if (req.files?.length) {
      for (const file of req.files) {
        try {
          const imageData = await uploadImage(file.buffer)
          images.push(imageData)
        } catch (err) {
          console.error("Image upload failed:", err)
        }
      }
    }

    const note = new Note({
      title: title.trim(),
      category: category.trim(),
      content: content?.trim() || "",
      images,
      owner: req.user._id,
      template: template || null,
      isFavorite: false,
      lastViewed: new Date(),
    })

    await note.save()
    await note.populate("owner", "firstName lastName email")
    res.status(201).json({ note })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user._id })
      .populate("owner", "firstName lastName email")
      .sort({ createdAt: -1 })
    res.json({ notes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id }).populate(
      "owner",
      "firstName lastName email",
    )
    if (!note) return res.status(404).json({ message: "Note not found" })

    // Update last viewed
    note.lastViewed = new Date()
    await note.save()

    res.json({ note })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateNote = async (req, res) => {
  try {
    const { title, category, content } = req.body
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id })
    if (!note) return res.status(404).json({ message: "Note not found" })

    if (req.files?.length) {
      for (const file of req.files) {
        try {
          const imageData = await uploadImage(file.buffer)
          note.images.push(imageData)
        } catch (err) {
          console.error("Image upload failed:", err)
        }
      }
    }

    if (title) note.title = title.trim()
    if (category) note.category = category.trim()
    if (content !== undefined) note.content = content.trim()

    await note.save()
    await note.populate("owner", "firstName lastName email")
    res.json({ note })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id })
    if (!note) return res.status(404).json({ message: "Note not found" })

    note.isFavorite = !note.isFavorite
    await note.save()
    await note.populate("owner", "firstName lastName email")
    res.json({ note })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id })
    if (!note) return res.status(404).json({ message: "Note not found" })

    for (const image of note.images) {
      try {
        await deleteImage(image.publicId)
      } catch (err) {
        console.error("Image delete failed:", err)
      }
    }

    await Note.findByIdAndDelete(req.params.id)
    res.json({ message: "Note deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteNoteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params
    const note = await Note.findOne({ _id: id, owner: req.user._id })
    if (!note) return res.status(404).json({ message: "Note not found" })

    const imageIndex = note.images.findIndex((img) => img._id.toString() === imageId)
    if (imageIndex === -1) return res.status(404).json({ message: "Image not found" })

    try {
      await deleteImage(note.images[imageIndex].publicId)
    } catch (err) {
      console.error("Cloudinary delete failed:", err)
    }

    note.images.splice(imageIndex, 1)
    await note.save()
    res.json({ message: "Image deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  deleteNoteImage,
  toggleFavorite,
  upload,
}
