import { Router } from 'express';
import upload from '../middleware/uploadMiddleware';
import { uploadFile } from '../controllers/uploadController';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);

export default router;