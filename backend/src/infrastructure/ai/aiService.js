const config = require('../../config/env');
const logger = require('../../utils/logger');

class AIService {
  constructor() {
    this.groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.openAiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * Helper to determine if a key is a mock placeholder or empty.
   */
  isMock(key) {
    return !key || key.startsWith('mock_') || key === 'mock-key';
  }

  /**
   * Execute a function with retry logic (exponential backoff).
   */
  async withRetry(fn, retries = 2, delayMs = 1000) {
    let attempt = 0;
    while (attempt <= retries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt > retries) throw error;
        const wait = delayMs * Math.pow(2, attempt);
        logger.warn(`AI request failed. Retrying in ${wait}ms... (Attempt ${attempt}/${retries}). Error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, wait));
      }
    }
  }

  /**
   * Generates a non-streaming chat completion.
   * Auto-retries Groq, falls back to OpenAI on failure.
   */
  async generateCompletion(messages, options = {}) {
    const isJson = options.response_format === 'json' || options.jsonMode === true;
    
    const run = async () => {
      // 1. Try Groq (Primary)
      if (!this.isMock(config.groq.apiKey)) {
        try {
          logger.info(`Sending completion request to Groq (${config.groq.model})`);
          return await this.fetchCompletion(this.groqUrl, config.groq.apiKey, config.groq.model, messages, isJson);
        } catch (error) {
          logger.error(`Groq completion failed: ${error.message}. Trying fallback...`);
        }
      } else {
        logger.warn('Groq API Key is mock or missing. Skipping Groq...');
      }

      // 2. Try OpenAI (Fallback)
      if (!this.isMock(config.openai.apiKey)) {
        logger.info(`Sending completion request to OpenAI (${config.openai.model})`);
        return await this.fetchCompletion(this.openAiUrl, config.openai.apiKey, config.openai.model, messages, isJson);
      }

      // 3. Both are mock/missing -> Return a friendly mock response so the system keeps working!
      logger.warn('Both Groq and OpenAI API keys are missing or mock. Returning mock fallback data.');
      return this.getMockResponse(messages, isJson);
    };

    return this.withRetry(run);
  }

  /**
   * Performs the HTTP fetch request to the AI providers.
   */
  async fetchCompletion(url, apiKey, model, messages, isJson) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = {
      model,
      messages,
      temperature: 0.7,
    };

    if (isJson) {
      body.response_format = { type: 'json_object' };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Handles streaming completion request and sends chunks via Server-Sent Events (SSE).
   */
  async generateStream(messages, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let accumulatedText = '';
    const writeChunk = (content) => {
      accumulatedText += content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    };

    const run = async () => {
      // 1. Try Groq Streaming
      if (!this.isMock(config.groq.apiKey)) {
        try {
          logger.info(`Streaming from Groq (${config.groq.model})`);
          await this.streamFromProvider(this.groqUrl, config.groq.apiKey, config.groq.model, messages, writeChunk);
          return;
        } catch (error) {
          logger.error(`Groq streaming failed: ${error.message}. Trying OpenAI fallback streaming...`);
        }
      }

      // 2. Try OpenAI Streaming Fallback
      if (!this.isMock(config.openai.apiKey)) {
        logger.info(`Streaming from OpenAI (${config.openai.model})`);
        await this.streamFromProvider(this.openAiUrl, config.openai.apiKey, config.openai.model, messages, writeChunk);
        return;
      }

      // 3. Fallback: Stream mock text word-by-word
      logger.warn('Mock stream started (no valid API keys found).');
      const mockReply = "Hello! Both Groq and OpenAI API keys are currently unconfigured or set to mock keys. Please configure GROQ_API_KEY or OPENAI_API_KEY in your backend .env file to enable live AI responses. Let me know if you need help with anything else!";
      const words = mockReply.split(' ');
      for (const word of words) {
        writeChunk(word + ' ');
        await new Promise(r => setTimeout(r, 60));
      }
    };

    try {
      await run();
    } catch (err) {
      logger.error(`Streaming completely failed: ${err.message}`);
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    } finally {
      res.write('data: [DONE]\n\n');
      res.end();
    }

    return accumulatedText;
  }

  /**
   * Fetch stream response and feed to chunk callback.
   */
  async streamFromProvider(url, apiKey, model, messages, onChunk) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API stream error (${response.status}): ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // keep trailing partial line

      for (const line of lines) {
        const cleaned = line.trim();
        if (!cleaned) continue;
        if (cleaned === 'data: [DONE]') continue;
        
        if (cleaned.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(cleaned.slice(6));
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Ignore parse errors for keep-alives or partial headers
          }
        }
      }
    }
  }

  /**
   * Standard local fallback responses when no API keys are supplied.
   * Guarantees that the app is 100% usable during offline development.
   */
  getMockResponse(messages, isJson) {
    const userMsg = messages[messages.length - 1]?.content || '';
    
    if (isJson) {
      // Return dummy JSON arrays depending on keywords to satisfy format validator
      if (userMsg.toLowerCase().includes('flashcard')) {
        return JSON.stringify([
          { question: "Define Database Normalization", answer: "The process of organizing data in a database to reduce redundancy and improve data integrity." },
          { question: "What is an Index in SQL?", answer: "A data structure that improves the speed of data retrieval operations on a database table." }
        ]);
      }
      if (userMsg.toLowerCase().includes('multiple choice') || userMsg.toLowerCase().includes('mcq')) {
        return JSON.stringify([
          {
            question: "Which of the following is a primary key characteristic?",
            options: ["Must be unique", "Can contain NULL values", "Cannot be indexed", "Can have duplicate entries"],
            correctAnswer: "Must be unique",
            explanation: "A primary key constraint uniquely identifies each record in a table. It cannot contain NULL values and must be unique."
          }
        ]);
      }
      
      // Generic JSON fallback
      return JSON.stringify({
        status: "mock",
        message: "This is a structured mock reply. Configure your API keys for real AI insights."
      });
    }

    // Standard text fallback
    return `**Hello!** I am your CampusFlow AI Companion. 

Currently, both Groq and OpenAI API keys are unconfigured (set to mock). Here is what you asked:
> ${userMsg}

To fetch live responses, edit your \`backend/.env\` with valid credentials. Let me know what else I can help you with!`;
  }
}

module.exports = new AIService();
