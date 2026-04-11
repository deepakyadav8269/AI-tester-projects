"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestCases = exports.testConnection = exports.getConfig = exports.updateConfig = exports.uploadFileHandler = void 0;
const llmService_1 = require("../services/llmService");
const pdfParse = require('pdf-parse');
const mammoth = __importStar(require("mammoth"));
let activeConfigs = {
    ollamaUrl: 'http://localhost:5173',
    ollamaModel: 'llama3.2',
    activeProvider: 'ollama',
    lmStudioUrl: 'http://localhost:1234/v1',
    grokKey: '',
    openAiKey: '',
    claudeKey: '',
    geminiKey: ''
};
const uploadFileHandler = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        let text = '';
        if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
            const data = await pdfParse(file.buffer);
            text = data.text;
        }
        else if (file.originalname.toLowerCase().endsWith('.docx')) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            text = result.value;
        }
        else {
            text = file.buffer.toString('utf-8');
        }
        res.json({ success: true, text });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.uploadFileHandler = uploadFileHandler;
const updateConfig = (req, res) => {
    const newConfigs = req.body;
    if (newConfigs.ollamaUrl && newConfigs.ollamaUrl.includes('5173')) {
        newConfigs.ollamaUrl = 'http://localhost:11434'; // Auto-fix user mistake
    }
    activeConfigs = { ...activeConfigs, ...newConfigs };
    res.json({ success: true, message: 'Configuration updated.' });
};
exports.updateConfig = updateConfig;
const getConfig = (req, res) => {
    res.json({ success: true, config: activeConfigs });
};
exports.getConfig = getConfig;
const testConnection = async (req, res) => {
    try {
        const configToTest = { ...activeConfigs, ...req.body };
        const llmService = new llmService_1.LLMService(configToTest);
        const result = await llmService.testProviderConnection();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.testConnection = testConnection;
const generateTestCases = async (req, res) => {
    try {
        const { requirement } = req.body;
        console.log(`Received request to generate test cases for: ${requirement}`);
        if (!requirement) {
            return res.status(400).json({ error: 'Requirement is required.' });
        }
        const systemPrompt = `You are an expert QA Engineer. Generate comprehensive Functional and Non-Functional, Positive and negative test cases based on the user's requirement.
    
You must output the test cases strictly as a single Markdown table in Jira format.
The table should have the following exact columns and markdown structure:
| Issue Type | Summary | Objective | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|

Do not add any additional text before or after the table. Ensure you generate at least 3 functional and 2 non-functional test cases represented as rows in the table.`;
        const llmService = new llmService_1.LLMService(activeConfigs);
        console.log(`Using active configs:`, activeConfigs);
        const response = await llmService.generateCompletion(systemPrompt, requirement);
        console.log(`Generated response successfully.`);
        res.json({ success: true, content: response });
    }
    catch (error) {
        console.error(`Error generating test cases:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.generateTestCases = generateTestCases;
