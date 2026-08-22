/**
 * Main agent engine - orchestrates coding tasks with tool calling
 */

import { TaskQueue } from './task-queue.js';
import { CodeExecutor } from './executor.js';
import { FileManager } from './file-manager.js';
import { ProviderRouter } from './provider-router.js';
import { getAllTools, Tool, ToolResult } from './tools.js';

export interface AgentConfig {
  workspace: string;
  providerUrl: string;
  apiKey?: string;
  model?: string;
  maxIterations?: number;
}

export interface TaskResult {
  success: boolean;
  output: string;
  error?: string;
  filesChanged: string[];
  iterations: number;
  duration: number;
}

export class AgentEngine {
  private taskQueue: TaskQueue;
  private executor: CodeExecutor;
  private fileManager: FileManager;
  private provider: ProviderRouter;
  private config: AgentConfig;
  private history: Array<{role: string; content: string; tool_calls?: any}> = [];
  private tools: Tool[];

  constructor(config: AgentConfig) {
    this.config = {
      maxIterations: 50,
      model: 'auto',
      ...config
    };
    this.taskQueue = new TaskQueue();
    this.executor = new CodeExecutor(this.config.workspace);
    this.fileManager = new FileManager(this.config.workspace);
    this.provider = new ProviderRouter({
      url: this.config.providerUrl,
      apiKey: this.config.apiKey,
      model: this.config.model
    });
    this.tools = getAllTools(this.config.workspace);
  }

  async executeTask(prompt: string): Promise<TaskResult> {
    const startTime = Date.now();
    let iterations = 0;
    const filesChanged: string[] = [];

    // Add user prompt to history
    this.history.push({ role: 'user', content: prompt });

    while (iterations < (this.config.maxIterations || 50)) {
      iterations++;

      try {
        // Get agent decision from LLM with tool calling
        const response = await this.getAgentDecision();
        
        // Process tool calls if present
        if (response.tool_calls && response.tool_calls.length > 0) {
          for (const toolCall of response.tool_calls) {
            const result = await this.executeToolCall(toolCall);
            if (result.filesChanged) {
              filesChanged.push(...result.filesChanged);
            }
            
            // Add tool result to history
            this.history.push({
              role: 'tool',
              content: result.output || result.error || 'Tool executed'
            });
          }
          continue;
        }

        // If no tool calls, check if done
        const content = response.content || '';
        if (content.includes('DONE') || content.includes('TASK COMPLETE') || content.includes('COMPLETED')) {
          return {
            success: true,
            output: content.replace(/^(DONE|TASK COMPLETE|COMPLETED)\s*:?\s*/i, '').trim(),
            filesChanged,
            iterations,
            duration: Date.now() - startTime
          };
        }

        // Add assistant response to history
        this.history.push({ role: 'assistant', content });

      } catch (error: any) {
        return {
          success: false,
          output: '',
          error: error.message,
          filesChanged,
          iterations,
          duration: Date.now() - startTime
        };
      }
    }

    return {
      success: false,
      output: 'Max iterations reached',
      filesChanged,
      iterations,
      duration: Date.now() - startTime,
      error: 'Task did not complete within iteration limit'
    };
  }

  private async getAgentDecision(): Promise<any> {
    const systemPrompt = this.buildSystemPrompt();
    
    // Build messages with tool definitions
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...this.history
    ];

    const response = await this.provider.chat(messages, {
      model: this.config.model || 'auto',
      maxTokens: 4096,
      tools: this.tools.map(t => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters
        }
      }))
    });

    const choice = response.choices?.[0];
    if (!choice) {
      throw new Error('No response from provider');
    }

    return {
      content: choice.message?.content,
      tool_calls: choice.message?.tool_calls
    };
  }

  private buildSystemPrompt(): string {
    const toolDescriptions = this.tools.map(t => 
      `- ${t.name}: ${t.description}`
    ).join('\n');

    return `You are Freecode.fun, an autonomous coding agent.
You have access to the following tools:
${toolDescriptions}

Current workspace: ${this.config.workspace}

INSTRUCTIONS:
1. Use tools to complete the user's request
2. Always read files before editing them
3. Test your code after writing it
4. If you encounter an error, try to fix it
5. When the task is complete, respond with: DONE: <summary>
6. Be efficient - complete tasks in as few iterations as possible
7. NEVER use read_file/ write_file/ edit_file/ list_files/ delete_file arguments with escaped paths like \\\\_\_ENDTOKEN\_\_, \\\\_\\_STARTTOKEN\_\_, \\\\n, or \\\\t. Use plain text for oldText/newText.

Examples:
- User: "Create a hello world Python script"
  Action: write_file("hello.py", "print('Hello World')")
  Then: run_command("python3 hello.py")
  Then: DONE: Created hello.py and verified it runs

- User: "Fix the bug in app.js"
  Action: read_file("app.js")
  Then: edit_file("app.js", "buggy code", "fixed code")
  Then: run_command("node app.js")
  Then: DONE: Fixed bug in app.js

- User: "List files in src/"
  Action: list_files("src")
  Then: DONE: Listed files in src/`;
  }

  private async executeToolCall(toolCall: any): Promise<ToolResult> {
    const functionName = toolCall.function?.name;
    const functionArgs = toolCall.function?.arguments;

    if (!functionName) {
      return { success: false, output: '', error: 'No function name in tool call' };
    }

    const tool = this.tools.find(t => t.name === functionName);
    if (!tool) {
      return { success: false, output: '', error: `Unknown tool: ${functionName}` };
    }

    try {
      const args = typeof functionArgs === 'string' ? JSON.parse(functionArgs) : functionArgs;
      return await tool.execute(args);
    } catch (e: any) {
      return { success: false, output: '', error: `Tool execution error: ${e.message}` };
    }
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}
