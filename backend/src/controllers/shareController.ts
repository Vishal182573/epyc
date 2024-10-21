import { Request, Response } from 'express';
import { FileShare } from '../models/fileShareModel';
import generateCode from '../utils/randomKeyGenerator';
import { sendEmail } from '../utils/sendEmail';
import cloudinary from '../config/cloudinary';

export const shareFile = async (req: Request, res: Response) => {
  try {
    console.log('Received request body:', req.body);  // Log the entire request body
    const { receiverEmail, fileUrl } = req.body;

    if (!receiverEmail || !fileUrl) {
      return res.status(400).json({ message: 'Receiver email and file URL are required' });
    }

    const code = generateCode();
    const newFileShare = new FileShare({
      code,
      fileUrl
    });
    await newFileShare.save();

    await sendEmail({
      to: receiverEmail,
      subject: 'Your File is Ready for Download',
      code,
      fileUrl
    });

    res.status(200).json({ message: 'File shared successfully', code });
  } catch (error) {
    console.error('Error sharing file:', error);
    res.status(500).json({ message: 'Error sharing file' });
  }
};

export const retrieveFile = async (req: Request, res: Response) => {
  try {
    console.log('Received request body:', req.body);  // Log the entire request body
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const fileShare = await FileShare.findOne({ code });
    if (!fileShare) {
      return res.status(404).json({ message: 'File not found or code is invalid' });
    }

    const { fileUrl } = fileShare;
    const publicId = fileUrl.split('/').slice(-2).join('/').split('.')[0];

    if (publicId) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
          console.error('Failed to delete file from Cloudinary:', result);
        } else {
          console.log('File successfully deleted from Cloudinary');
        }
      } catch (cloudinaryError) {
        console.error('Error deleting file from Cloudinary:', cloudinaryError);
      }
    }

    await FileShare.deleteOne({ _id: fileShare._id });
    res.status(200).json({ message: 'File retrieved successfully', fileUrl });
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
};