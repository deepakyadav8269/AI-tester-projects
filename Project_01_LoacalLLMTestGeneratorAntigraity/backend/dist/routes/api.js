"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const llmController_1 = require("../controllers/llmController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get('/config', llmController_1.getConfig);
router.post('/config', llmController_1.updateConfig);
router.post('/generate', llmController_1.generateTestCases);
router.post('/test-connection', llmController_1.testConnection);
router.post('/upload', upload.single('file'), llmController_1.uploadFileHandler);
exports.default = router;
