const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isFavorite: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    template: { type: String, default: null },
    lastViewed: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Note", noteSchema)
