import { Router } from 'express';
import { shareFile, retrieveFile } from '../controllers/shareController';

const router = Router();

router.post('/share', shareFile);
router.post('/retrieve', retrieveFile);

export default router;