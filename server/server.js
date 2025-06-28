const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const authRoutes = require("./routes/authRoutes")
const noteRoutes = require("./routes/noteRoutes")

dotenv.config()

const app = express()

// Middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err))

// Welcome Endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API! Server is running." })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/notes", noteRoutes)

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ message: err.message })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))