import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    const file = req.file; // Multer stores the uploaded file in req.file

    // Use Cloudinary's uploader
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'cookbook' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      file.stream.pipe(stream);
    });

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
