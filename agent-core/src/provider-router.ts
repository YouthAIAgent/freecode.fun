/**
 * Provider router for LLM calls
 */

export interface ProviderConfig {
  url: string;
  apiKey?: string;
  model?: string;
}

export class ProviderRouter {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async chat(messages: Array<{role: string; content: string}>, options?: {
    model?: string;
    stream?: boolean;
    maxTokens?: number;
  }): Promise<any> {
    const body: any = {
      model: options?.model || this.config.model || 'auto',
      messages,
      max_tokens: options?.maxTokens || 4096
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(`${this.config.url}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Provider error ${response.status}: ${error}`);
    }

    return response.json();
  }

  async listModels(): Promise<any> {
    const headers: Record<string, string> = {};
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(`${this.config.url}/v1/models`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status}`);
    }

    return response.json();
  }
}
