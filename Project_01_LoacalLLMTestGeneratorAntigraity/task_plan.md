# Task Plan

## Blueprint
*(Approved)*
**App Type:** Full-stack Web Application
**Frontend:** React with TypeScript
**Backend:** Node.js with TypeScript
**Purpose:** Generate Functional and Non-Functional test cases for Web Applications and APIs based on Jira requirements.
**Output Format:** Test cases output in Jira format.
**LLM Integrations:** Support for Ollama API, LM Studio API, Grok API, OpenAI, Claude API, and Gemini API via a Settings UI.

### Design Breakdown:
1.  **Main Chat Interface:**
    *   Sidebar: History of generated test cases.
    *   Main Area: Display area for the generated test case output.
    *   Input Area: Text input ("Ask here is here TC for Requirement") for copy/pasting Jira requirements.
2.  **Settings Panel:**
    *   Configuration sections for various LLMs (Ollama, Grok, OpenAI, etc.).
    *   "Test Connection" button to verify API validity.
    *   "Save Button" to persist configurations.

## Phases and Goals
- [x] Phase 1: Discovery and Planning
- [x] Phase 2: Implementation
- [x] Phase 3: Testing and Refinement

## Checklists
### Phase 3: Testing
- [x] Launch Backend server
- [x] Launch Frontend server
- [x] Verify UI Rendering
- [x] Verify Settings Configuration logic
- [x] Verify LLM Generate connection logic

## Checklists
### Phase 2: Implementation Setup
- [ ] Initialize React + TypeScript Frontend
- [ ] Initialize Node.js + TypeScript Backend
- [ ] Build Basic UI Layout (Chat & Settings views)
- [ ] Build Backend LLM Configuration APIs
- [ ] Connect Frontend and Backend
