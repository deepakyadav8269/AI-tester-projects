"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const axios_1 = __importDefault(require("axios"));
class LLMService {
    config;
    constructor(config) {
        this.config = config;
    }
    async testProviderConnection() {
        try {
            switch (this.config.activeProvider) {
                case 'ollama':
                    await axios_1.default.get(`${this.config.ollamaUrl}`);
                    return { success: true, message: 'Connected to Ollama' };
                case 'lmstudio':
                    await axios_1.default.get(`${this.config.lmStudioUrl}/models`);
                    return { success: true, message: 'Connected to LM Studio' };
                case 'openai':
                    await axios_1.default.get('https://api.openai.com/v1/models', {
                        headers: { Authorization: `Bearer ${this.config.openAiKey}` }
                    });
                    return { success: true, message: 'Connected to OpenAI' };
                case 'grok':
                    await axios_1.default.get('https://api.x.ai/v1/models', {
                        headers: { Authorization: `Bearer ${this.config.grokKey}` }
                    });
                    return { success: true, message: 'Connected to Grok API' };
                case 'gemini':
                    await axios_1.default.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.config.geminiKey}`);
                    return { success: true, message: 'Connected to Gemini API' };
                case 'claude':
                    // Claude doesn't have a simple GET /models without specific headers, so we check using an empty completion or just fail if key is missing
                    if (!this.config.claudeKey)
                        throw new Error('Claude API key missing');
                    return { success: true, message: 'Claude Configured (Test skipped)' };
                default:
                    throw new Error('Unknown provider');
            }
        }
        catch (e) {
            return { success: false, message: e.message || 'Connection failed' };
        }
    }
    async generateCompletion(systemPrompt, userPrompt) {
        try {
            switch (this.config.activeProvider) {
                case 'ollama': {
                    const res = await axios_1.default.post(`${this.config.ollamaUrl}/api/generate`, {
                        model: this.config.ollamaModel,
                        prompt: `${systemPrompt}\n\nRequirement: ${userPrompt}`,
                        stream: false
                    });
                    return res.data.response;
                }
                case 'lmstudio': {
                    const res = await axios_1.default.post(`${this.config.lmStudioUrl}/chat/completions`, {
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ]
                    });
                    return res.data.choices[0].message.content;
                }
                case 'openai': {
                    const res = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                        model: 'gpt-4o', // default
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ]
                    }, {
                        headers: { Authorization: `Bearer ${this.config.openAiKey}` }
                    });
                    return res.data.choices[0].message.content;
                }
                case 'grok': {
                    const res = await axios_1.default.post('https://api.x.ai/v1/chat/completions', {
                        model: 'grok-beta',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ]
                    }, {
                        headers: { Authorization: `Bearer ${this.config.grokKey}` }
                    });
                    return res.data.choices[0].message.content;
                }
                case 'gemini': {
                    const res = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.config.geminiKey}`, {
                        contents: [{
                                parts: [{ text: `${systemPrompt}\n\nUser Request: ${userPrompt}` }]
                            }]
                    });
                    return res.data.candidates[0].content.parts[0].text;
                }
                case 'claude': {
                    const res = await axios_1.default.post('https://api.anthropic.com/v1/messages', {
                        model: 'claude-3-5-sonnet-20240620',
                        max_tokens: 4000,
                        system: systemPrompt,
                        messages: [
                            { role: 'user', content: userPrompt }
                        ]
                    }, {
                        headers: {
                            'x-api-key': this.config.claudeKey,
                            'anthropic-version': '2023-06-01'
                        }
                    });
                    return res.data.content[0].text;
                }
                default:
                    return 'Unsupported LLM Provider';
            }
        }
        catch (e) {
            console.error(e);
            if (e.response?.data) {
                const errData = e.response.data;
                const errMsg = errData.error || errData.message || JSON.stringify(errData);
                // Friendly OOM error for local models
                if (typeof errMsg === 'string' && (errMsg.includes('allocate CUDA') || errMsg.includes('out of memory') || errMsg.includes('loading model'))) {
                    return `Provider Error: ${errMsg}\n\n💡 TIP: Your computer might not have enough memory to run this model. Try opening the Settings Panel and changing the Ollama Model to a smaller one (e.g., 'llama3.2:1b' or 'qwen2:0.5b').`;
                }
                // Friendly Model Not Found error
                if (typeof errMsg === 'string' && errMsg.includes('model') && errMsg.includes('not found')) {
                    return `Provider Error: ${errMsg}\n\n💡 TIP: You haven't downloaded this model yet! Open your terminal/command prompt and run: 'ollama run ${this.config.ollamaModel}' to download it, then try again.`;
                }
                return `Provider Error: ${errMsg}`;
            }
            return `Error: ${e.message}`;
        }
    }
}
exports.LLMService = LLMService;
