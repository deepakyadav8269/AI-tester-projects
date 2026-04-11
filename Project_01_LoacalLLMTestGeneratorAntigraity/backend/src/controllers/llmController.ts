import { Request, Response } from 'express';
import { LLMService } from '../services/llmService';
const pdfParse = require('pdf-parse');
import * as mammoth from 'mammoth';

let activeConfigs = {
  ollamaUrl: 'http://localhost:5173',
  ollamaModel: 'llama3.2',
  activeProvider: 'ollama' as 'ollama' | 'lmstudio' | 'openai' | 'claude' | 'gemini' | 'grok',
  lmStudioUrl: 'http://localhost:1234/v1',
  grokKey: '',
  openAiKey: '',
  claudeKey: '',
  geminiKey: ''
};

export const uploadFileHandler = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';

    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else if (file.originalname.toLowerCase().endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else {
      text = file.buffer.toString('utf-8');
    }

    res.json({ success: true, text });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateConfig = (req: Request, res: Response) => {
  const newConfigs = req.body;
  if (newConfigs.ollamaUrl && newConfigs.ollamaUrl.includes('5173')) {
      newConfigs.ollamaUrl = 'http://localhost:11434'; // Auto-fix user mistake
  }
  activeConfigs = { ...activeConfigs, ...newConfigs };
  res.json({ success: true, message: 'Configuration updated.' });
};

export const getConfig = (req: Request, res: Response) => {
  res.json({ success: true, config: activeConfigs });
};

export const testConnection = async (req: Request, res: Response) => {
  try {
    const configToTest = { ...activeConfigs, ...req.body };
    const llmService = new LLMService(configToTest);
    const result = await llmService.testProviderConnection();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateTestCases = async (req: Request, res: Response) => {
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

    const llmService = new LLMService(activeConfigs);
    console.log(`Using active configs:`, activeConfigs);
    const response = await llmService.generateCompletion(systemPrompt, requirement);

    console.log(`Generated response successfully.`);
    res.json({ success: true, content: response });
  } catch (error: any) {
    console.error(`Error generating test cases:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};
