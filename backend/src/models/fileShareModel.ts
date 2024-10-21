import mongoose, { Document, Schema } from 'mongoose';

interface IFileShare extends Document {
  code: string;
  fileUrl: string;
  createdAt: Date;
}

const fileShareSchema = new Schema<IFileShare>({
  code: { type: String, required: true, unique: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } 
});

export const FileShare = mongoose.model<IFileShare>('FileShare', fileShareSchema);