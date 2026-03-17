import express from 'express';
import { generateTestCases, testConnection, updateConfig } from '../controllers/llmController';

const router = express.Router();

router.post('/config', updateConfig);
router.post('/generate', generateTestCases);
router.post('/test-connection', testConnection);

export default router;
