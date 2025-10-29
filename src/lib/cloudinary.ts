import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadCVToCloudinary(
  buffer: Buffer,
  userId: string,
  cvName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Formato: CV_{YYYYMMDDHHMMSS}_{cvName}
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
    const sanitizedCvName = cvName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
    const fileName = `CV_${timestamp}_${sanitizedCvName}.docx`;
    
    console.log("=== NOMBRE DEL ARCHIVO EN CLOUDINARY ===");
    console.log("Nombre construido:", fileName);
    console.log("========================================");
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `cvs/${userId}`,
        resource_type: "raw", // Para archivos que no son imágenes/videos
        public_id: fileName,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Upload failed without error"));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
