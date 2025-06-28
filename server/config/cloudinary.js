require('dotenv').config(); // Add this line to load .env variables

const cloudinary = require("cloudinary").v2

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Test configuration on startup
const testConfig = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config()
  
  if (!cloud_name || !api_key || !api_secret) {
    console.error("❌ Cloudinary configuration incomplete!")
    console.log("Missing:", {
      cloud_name: !cloud_name ? "CLOUDINARY_CLOUD_NAME" : "✓",
      api_key: !api_key ? "CLOUDINARY_API_KEY" : "✓", 
      api_secret: !api_secret ? "CLOUDINARY_API_SECRET" : "✓"
    })
    return false
  }
  
  console.log("✅ Cloudinary configured successfully")
  return true
}

const uploadImage = async (imageBuffer, folder = "notes") => {
  try {
    const base64String = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`
    
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: "image",
      quality: "auto:good",
      fetch_format: "auto",
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message)
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    
    if (result.result === "ok") {
      console.log("✅ Image deleted successfully:", publicId)
    } else {
      console.log("⚠️ Image deletion result:", result)
    }
    
    return result
  } catch (error) {
    console.error("❌ Error deleting image:", error.message)
    throw error
  }
}

testConfig()

module.exports = { uploadImage, deleteImage }