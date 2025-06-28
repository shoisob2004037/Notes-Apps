const User = require("../models/User")
const jwt = require("jsonwebtoken")

const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: "7d" })

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: "User already exists" })

    const user = new User({ firstName, lastName, email, password })
    await user.save()

    const token = generateToken(user._id)
    res.status(201).json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)
    res.json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProfile = async (req, res) => {
  res.json({
    user: { id: req.user._id, firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email },
  })
}

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName

    await user.save()

    res.json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body

    // Verify email matches the authenticated user
    if (email !== req.user.email) {
      return res.status(400).json({ message: "Email verification failed" })
    }

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found with this email" })

    // In a real app, you would send an email with a reset token
    // For this demo, we'll just verify the email exists
    res.json({ message: "Email verified. You can now reset your password." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    user.password = newPassword
    await user.save()

    res.json({ message: "Password reset successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword }
