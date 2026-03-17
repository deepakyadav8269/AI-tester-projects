"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const llmController_1 = require("../controllers/llmController");
const router = express_1.default.Router();
router.post('/config', llmController_1.updateConfig);
router.post('/generate', llmController_1.generateTestCases);
router.post('/test-connection', llmController_1.testConnection);
exports.default = router;
