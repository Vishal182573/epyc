import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

interface CloudinaryFile extends Express.Multer.File {
  path: string;
  filename: string;
}

const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const file = req.file as CloudinaryFile;

    console.log('Uploaded file:', file);

    if (!file.path) {
      throw new Error('File path not found');
    }

    const fileUrl = file.path;
    const fileType = file.mimetype;
    const fileName = file.originalname;

    const downloadUrl = cloudinary.url(file.filename, {
      flags: 'attachment',
      format: fileType.split('/')[1], 
    });
    let viewUrl = fileUrl;
    if (fileType === 'application/pdf') {
      viewUrl = cloudinary.url(file.filename, {
        flags: 'inline',
      });
    }

    return res.status(200).json({
      message: 'File uploaded successfully',
      viewUrl: viewUrl,
      downloadUrl: downloadUrl,
      fileType: fileType,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error in file upload:', error);
    return res.status(500).json({ message: 'Error uploading file', error: String(error) });
  }
};

export { uploadFile };