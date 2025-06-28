const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const authRoutes = require("./routes/authRoutes")
const noteRoutes = require("./routes/noteRoutes")

dotenv.config()

const app = express()

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,

].filter(Boolean) 

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-to-server requests, Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

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
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  })
  res.status(500).json({ message: "Internal Server Error", error: err.message })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))