# Findings

## Research
- The application will be a web UI built with React + Node.js (TypeScript).
- Needs a robust backend to handle API calls to multiple different LLM providers.
- Local LLMs (Ollama, LM Studio) will likely need configurable base URLs, while cloud APIs (OpenAI, Claude, Gemini, Grok) will need API keys.

## Discoveries
- Design wireframe shows a clear two-pane layout or two distinct views:
  1.  **Chat/Generator View:** Left sidebar (History), large output area (Generated Test Cases), bottom input box.
  2.  **Settings View:** Stacked input fields for different LLM settings, a "Save" button, and a "Test Connection" button.
- The output must specifically be formatted for Jira.

## Constraints
- **Must** provide test cases in Jira format. (Implemented via Backend System Prompting)
- Output **must** include both Functional and Non-Functional test cases. (Implemented via Backend System Prompting)
- **Tech Stack Constraint:** Node.js backend, React frontend, both using TypeScript. (Successfully utilized npx create-vite and tsx)
- **Protocol 0 Constraint:** No execution/scripts until discovery is complete and the blueprint is approved by the user. (Protocol honored)
