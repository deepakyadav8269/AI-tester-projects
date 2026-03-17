"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestCases = exports.testConnection = exports.updateConfig = void 0;
const llmService_1 = require("../services/llmService");
let activeConfigs = {
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3.2',
    activeProvider: 'ollama',
    lmStudioUrl: 'http://localhost:1234/v1',
    grokKey: '',
    openAiKey: '',
    claudeKey: '',
    geminiKey: ''
};
const updateConfig = (req, res) => {
    activeConfigs = { ...activeConfigs, ...req.body };
    res.json({ success: true, message: 'Configuration updated.' });
};
exports.updateConfig = updateConfig;
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
        const systemPrompt = `You are an expert QA Engineer. Generate comprehensive Functional and Non-Functional test cases based on the user's requirement.
    
You must output the test cases strictly as a single Markdown table in Jira format.
The table should have the following exact columns:
| Issue Type | Summary | Objective | Preconditions | Test Steps | Expected Result |

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
