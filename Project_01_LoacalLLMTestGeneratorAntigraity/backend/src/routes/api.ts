import express from 'express';
import multer from 'multer';
import { generateTestCases, testConnection, updateConfig, uploadFileHandler, getConfig } from '../controllers/llmController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/config', getConfig);
router.post('/config', updateConfig);
router.post('/generate', generateTestCases);
router.post('/test-connection', testConnection);
router.post('/upload', upload.single('file'), uploadFileHandler);

export default router;
