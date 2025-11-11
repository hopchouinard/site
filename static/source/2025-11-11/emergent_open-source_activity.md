---
domain: Emergent Open-Source Activity
date: 2025-11-11
priority: medium
---

# Emergent Open-Source Activity - 2025-11-11

Loaded cached credentials.
Attempt 1 failed: You have exhausted your capacity on this model. Your quota will reset after 0s.. Retrying after 56.271624ms...
Attempt 2 failed with status 429. Retrying with backoff... GaxiosError: [{
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
      date: 'Tue, 11 Nov 2025 12:00:32 GMT',
      server: 'ESF',
      'server-timing': 'gfet4t7; dur=13360',
      vary: 'Origin, X-Origin, Referer',
      'x-cloudaicompanion-trace-id': '490b5e170e917cfe',
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
Here are some new open-source AI frameworks, libraries, and datasets released this week (November 4-11, 2025):

**Frameworks and Models:**
*   **Moonshot AI's Kimi K2 Thinking model** (released November 8, 2025): An open-source reasoning variant of their Kimi K2 model, noted for outperforming some closed-source AI systems.
*   **Meta's Omnilingual ASR** (announced November 11, 2025): A new open-source automatic speech recognition (ASR) system capable of understanding and transcribing over 1,600 spoken languages, including approximately 500 low-resource languages.
*   **AI2's OlmoEarth** (announced week of November 7, 2025): A suite of open-source foundation models and infrastructure aimed at addressing global challenges in climate, environment, and society.
*   **VS Code's Open Source AI Editor** (new milestone November 6, 2025): Open-sourced its inline AI suggestions as part of consolidating AI functionality into a single Copilot Chat extension.

**Libraries:**
*   **Google's Magika 1.0** (released November 6, 2025): An AI-powered file type detection system, rebuilt in Rust, offering faster performance, improved intelligence, and expanded file type support for over 200 types.

**Datasets:**
*   **Encord's EMM1** (released November 9, 2025): Described as the "world's largest open-source multimodal dataset," reported to deliver up to 17 times better training efficiency.
*   **Meta** also released a dataset alongside its **Omnilingual ASR** system, supporting over 1,600 languages.
