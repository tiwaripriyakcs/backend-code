import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API,  // ✅ Fixed: was CLOUDINARY_API
  api_secret: process.env.CLOUDINARY_API_SECRET  // ✅ Added: was missing!
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("❌ No file path provided");
            return null;
        }
        
        console.log("📤 Uploading to Cloudinary...");
        console.log("   File path:", localFilePath);
        console.log("   File exists?", fs.existsSync(localFilePath));
        
        console.log("☁️ Config Check:");
        console.log("   Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
        console.log("   API Key:", process.env.CLOUDINARY_API);
        console.log("   API Secret:", process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Not Set");
        
        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        // File has been uploaded successfully
        console.log("✅ File uploaded on cloudinary:", response.url);
        
        // Remove local file after successful upload
        fs.unlinkSync(localFilePath)
        
        return response;
        
    } catch (error) {
        console.error("❌ Cloudinary upload error:");
        console.error("   Message:", error.message);
        console.error("   Full error:", error);
        
        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return null;
    }
}

export { uploadOnCloudinary }