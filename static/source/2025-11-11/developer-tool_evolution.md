---
domain: Developer-Tool Evolution
date: 2025-11-11
priority: medium
---

# Developer-Tool Evolution - 2025-11-11

Loaded cached credentials.
Attempt 1 failed with status 429. Retrying with backoff... GaxiosError: [{
  "error": {
    "code": 429,
    "message": "Resource exhausted. Please try again later. Please refer to https://cloud.google.com/vertex-ai/generative-ai/docs/error-code-429 for more details.",
    "errors": [
      {
        "message": "Resource exhausted. Please try again later. Please refer to https://cloud.google.com/vertex-ai/generative-ai/docs/error-code-429 for more details.",
        "domain": "global",
        "reason": "rateLimitExceeded"
      }
    ],
    "status": "RESOURCE_EXHAUSTED"
  }
}
]
    at Gaxios._request (/opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/gaxios/build/src/gaxios.js:142:23)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async OAuth2Client.requestAsync (/opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/google-auth-library/build/src/auth/oauth2client.js:429:18)
    at async CodeAssistServer.requestStreamingPost (file:///opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/code_assist/server.js:106:21)
    at async CodeAssistServer.generateContentStream (file:///opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/code_assist/server.js:25:23)
    at async file:///opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/core/loggingContentGenerator.js:116:26
    at async runInDevTraceSpan (file:///opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/telemetry/trace.js:33:16)
    at async retryWithBackoff (file:///opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/utils/retry.js:74:28)
    at async GeminiChat.makeApiCallAndProcessStream (file:///opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/core/geminiChat.js:268:32)
    at async file:///opt/homebrew/Cellar/gemini-cli/0.13.0/libexec/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/core/geminiChat.js:220:40 {
  config: {
    url: 'https://cloudcode-pa.googleapis.com/v1internal:streamGenerateContent?alt=sse',
    method: 'POST',
    params: { alt: 'sse' },
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'GeminiCLI/v25.1.0 (darwin; arm64) google-api-nodejs-client/9.15.1',
      Authorization: '<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.',
      'x-goog-api-client': 'gl-node/25.1.0'
    },
    responseType: 'stream',
    body: '<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.',
    signal: AbortSignal { aborted: false },
    paramsSerializer: [Function: paramsSerializer],
    validateStatus: [Function: validateStatus],
    errorRedactor: [Function: defaultErrorRedactor]
  },
  response: {
    config: {
      url: 'https://cloudcode-pa.googleapis.com/v1internal:streamGenerateContent?alt=sse',
      method: 'POST',
      params: [Object],
      headers: [Object],
      responseType: 'stream',
      body: '<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.',
      signal: [AbortSignal],
      paramsSerializer: [Function: paramsSerializer],
      validateStatus: [Function: validateStatus],
      errorRedactor: [Function: defaultErrorRedactor]
    },
    data: '[{\n' +
      '  "error": {\n' +
      '    "code": 429,\n' +
      '    "message": "Resource exhausted. Please try again later. Please refer to https://cloud.google.com/vertex-ai/generative-ai/docs/error-code-429 for more details.",\n' +
      '    "errors": [\n' +
      '      {\n' +
      '        "message": "Resource exhausted. Please try again later. Please refer to https://cloud.google.com/vertex-ai/generative-ai/docs/error-code-429 for more details.",\n' +
      '        "domain": "global",\n' +
      '        "reason": "rateLimitExceeded"\n' +
      '      }\n' +
      '    ],\n' +
      '    "status": "RESOURCE_EXHAUSTED"\n' +
      '  }\n' +
      '}\n' +
      ']',
    headers: {
      'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
      'content-length': '514',
      'content-type': 'application/json; charset=UTF-8',
      date: 'Tue, 11 Nov 2025 12:02:17 GMT',
      server: 'ESF',
      'server-timing': 'gfet4t7; dur=12866',
      vary: 'Origin, X-Origin, Referer',
      'x-cloudaicompanion-trace-id': '4f2fad21906b48ac',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'x-xss-protection': '0'
    },
    status: 429,
    statusText: 'Too Many Requests',
    request: {
      responseURL: 'https://cloudcode-pa.googleapis.com/v1internal:streamGenerateContent?alt=sse'
    }
  },
  error: undefined,
  status: 429,
  Symbol(gaxios-gaxios-error): '6.7.1'
}
Here's a summary of recent features and releases for GitHub Copilot, Claude Code, and Cursor AI, primarily from 2025:

### GitHub Copilot

*   **Agent Mode:** Translates prompts into functional code, executes terminal commands, uses tools, and rectifies errors, with contextual awareness via the Model Context Protocol (MCP).
*   **Multi-Model AI Access:** Paid tiers now support various LLMs, including OpenAI's GPT-4o, Anthropic's Claude 3.5 and 3.7 Sonnet, and Google's Gemini 2.0 Flash.
*   **OpenAI Codex Integration:** Available in VS Code Insiders for Copilot Pro+ subscribers.
*   **Agent Sessions and Plan Mode:** Unified "Agent Sessions" for managing local and cloud agent sessions, and "Plan Mode" for creating and executing step-by-step implementation plans.
*   **GPT-5 Support:** Visual Studio August 2025 update includes GPT-5 model support for more powerful and context-aware suggestions.
*   **Smarter Chat and Custom Models:** Copilot Chat is more intelligent, retrieves code snippets, understands Git history, and allows users to connect their own models.
*   **Enhanced Control and UI:** Greater control over suggestions, improved chat and agent UI, and confirmation required for sensitive file edits.
*   **Copilot Spark and Repository Integration:** "Copilot Spark" (VIP coding editor) in public preview, and the agent can remember context within PRs and initiate new repositories.
*   **Claude Sonnet 4.5 Availability:** Generally available as a model within GitHub Copilot for Pro members.
*   **CLI Enhancements:** Updated CLI with enhanced model selection, image support, and streamlined UI.
*   **Raptor mini:** New experimental model rolling out in public preview for Pro, Pro+, and Free plans in Visual Studio Code.
*   **Consolidated VS Code Extension:** All Copilot functionality consolidated into a single "Copilot Chat" extension.

### Claude Code

*   **Web-Based Interface:** Browser-based portal for linking GitHub repositories, editing code, running tests, and generating pull requests.
*   **Voice Mode:** Interaction with Claude using voice through the Claude mobile app.
*   **Enhanced Debugging:** Analyzes bug traces, proposes fixes, and creates commits.
*   **Native VS Code Extension:** Brings Claude Code directly into the IDE with real-time diffs and a dedicated sidebar.
*   **Improved Terminal Experience:** Refreshed terminal with better status visibility and searchable prompt history.
*   **Claude Agent SDK:** Provides tools for custom agentic experiences, including subagents and hooks.
*   **Checkpoints:** Automatically saves code states before changes, allowing instant rewinds.
*   **Sonnet 4.5 Integration:** Powered by Sonnet 4.5 for complex development tasks.
*   **Hybrid Reasoning:** Claude 3.7 Sonnet allows switching between fast replies and detailed thought processes.
*   **Artifacts & Web Search:** Generates interactive code, tables, diagrams, images inline, and offers web search with citations.
*   **Web Fetch and Analytics API:** Agents can pull full page content or PDFs, and an API tracks daily usage and cost.
*   **Microcompact and Enhanced Subagents:** "Microcompact" clears old tool calls, and subagents can be @-mentioned with model selection.
*   **PDF Support:** Reads PDFs directly from the file system.
*   **Code Execution Tool:** New API tool for executing Python code in a secure, sandboxed environment.
*   **Memory Features:** Remembers chat context, generates memory summaries, and offers incognito chats.
*   **Cloud Execution:** All Claude Code tasks run in an isolated sandbox.

### Cursor AI

*   **Cursor 1.4 & 1.5 Updates:**
    *   **Version 1.5 (August 2025):** Seamless Linear integration, improved agent terminal flow, native OS notifications, MCP elicitation support, and Notebook upgrades.
    *   **Version 1.4 (August 2025):** Enhanced agent steerability, smarter tools for codebase navigation, ability to assign different models per agent, and transparent usage insights.
*   **Bugbot:** AI-powered code review tool integrated with GitHub for identifying errors in pull requests.
*   **Cursor 2.0 and Composer:**
    *   **Composer Model:** New frontier coding model designed for low-latency agentic coding, claiming to be four times faster.
    *   **Multi-Agent Interface:** Optimized for working with multiple agents in parallel, focusing on desired outcomes.
    *   **Parallel Agent Execution:** Runs up to eight agents concurrently using git worktrees or remote machines.
    *   **Improved Code Review:** Streamlined review of agent-made changes across multiple files.
    *   **Native Browser Tool:** AI agent can test its own work and iterate on solutions.
    *   **Sandboxed Terminals:** Agent commands run in a secure sandbox on macOS by default.
    *   **Team Commands and Voice Mode:** Teams can define custom commands, and a new voice mode allows agent control.
    *   **Performance Improvements:** Significant improvements to LSP loading and usage.
    *   **Enhanced Agent Tools:** Improved for relevant context selection, efficient token usage, and higher edit quality.
    *   **Browser Controls, Plan Mode, and Hooks:** Introduced in version 1.7.
    *   **Slash Commands and Summarization:** Version 1.6 introduced slash commands, summarization, and an improved Agent terminal.
