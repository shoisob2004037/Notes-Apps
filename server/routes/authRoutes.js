const express = require("express")
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/profile", authMiddleware, getProfile)
router.put("/profile", authMiddleware, updateProfile)
router.put("/change-password", authMiddleware, changePassword)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

module.exports = router
