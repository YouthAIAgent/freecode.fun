/**
 * Agent tools - file system, terminal, web search
 */

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: Record<string, any>) => Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
  filesChanged?: string[];
}

export class FileTools {
  constructor(private workspace: string) {}

  read(args: { path: string }): ToolResult {
    const fullPath = require('path').join(this.workspace, args.path);
    try {
      const content = require('fs').readFileSync(fullPath, 'utf-8');
      return { success: true, output: content };
    } catch (e: any) {
      return { success: false, output: '', error: e.message };
    }
  }

  write(args: { path: string; content: string }): ToolResult {
    const fullPath = require('path').join(this.workspace, args.path);
    try {
      const dir = require('path').dirname(fullPath);
      require('fs').mkdirSync(dir, { recursive: true });
      require('fs').writeFileSync(fullPath, args.content, 'utf-8');
      return { success: true, output: `Written ${args.path}`, filesChanged: [args.path] };
    } catch (e: any) {
      return { success: false, output: '', error: e.message };
    }
  }

  edit(args: { path: string; oldText: string; newText: string }): ToolResult {
    const fullPath = require('path').join(this.workspace, args.path);
    try {
      const content = require('fs').readFileSync(fullPath, 'utf-8');
      if (!content.includes(args.oldText)) {
        return { success: false, output: '', error: 'Old text not found in file' };
      }
      const newContent = content.replace(args.oldText, args.newText);
      require('fs').writeFileSync(fullPath, newContent, 'utf-8');
      return { success: true, output: `Edited ${args.path}`, filesChanged: [args.path] };
    } catch (e: any) {
      return { success: false, output: '', error: e.message };
    }
  }

  list(args: { path?: string } = {}): ToolResult {
    const fullPath = require('path').join(this.workspace, args.path || '');
    try {
      const entries = require('fs').readdirSync(fullPath, { withFileTypes: true });
      const files = entries.map(e => `${e.isDirectory() ? '[DIR]' : '[FILE]'} ${e.name}`).join('\n');
      return { success: true, output: files || '(empty)' };
    } catch (e: any) {
      return { success: false, output: '', error: e.message };
    }
  }

  delete(args: { path: string }): ToolResult {
    const fullPath = require('path').join(this.workspace, args.path);
    try {
      require('fs').unlinkSync(fullPath);
      return { success: true, output: `Deleted ${args.path}`, filesChanged: [args.path] };
    } catch (e: any) {
      return { success: false, output: '', error: e.message };
    }
  }
}

export class TerminalTools {
  constructor(private workspace: string) {}

  async run(args: { command: string; cwd?: string; timeout?: number }): Promise<ToolResult> {
    const { execSync } = require('child_process');
    const options = {
      cwd: args.cwd || this.workspace,
      timeout: args.timeout || 30000,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    };

    try {
      const output = execSync(args.command, options);
      return { success: true, output: output.toString().trim() };
    } catch (e: any) {
      return { success: false, output: e.stdout?.toString()?.trim() || '', error: e.stderr?.toString()?.trim() || e.message };
    }
  }

  async runBackground(args: { command: string; cwd?: string }): Promise<ToolResult> {
    const { spawn } = require('child_process');
    return new Promise((resolve) => {
      const proc = spawn(args.command, { cwd: args.cwd || this.workspace, shell: true, detached: true });
      proc.unref();
      resolve({ success: true, output: `Started background process: ${args.command}` });
    });
  }
}

export class WebTools {
  async search(args: { query: string; maxResults?: number }): Promise<ToolResult> {
    try {
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(args.query)}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Freecode.fun)' }
      });
      const html = await response.text();
      
      // Simple extraction of results
      const results: string[] = [];
      const regex = /<a[^>]+class="result__a"[^>]*>([^<]+)<\/a>/g;
      let match;
      while ((match = regex.exec(html)) && results.length < (args.maxResults || 5)) {
        results.push(match[1].trim());
      }
      
      return { success: true, output: results.join('\n') || 'No results found' };
    } catch (e: any) {
      return { success: false, output: '', error: e.message };
    }
  }

  async fetch(args: { url: string }): Promise<ToolResult> {
    try {
      const response = await fetch(args.url);
      const text = await response.text();
      return { success: true, output: text.slice(0, 5000) }; // Limit output
    } catch (e: any) {
      return { success: false, output: '', error: e.message };
    }
  }
}

export function getAllTools(workspace: string) {
  const fileTools = new FileTools(workspace);
  const terminalTools = new TerminalTools(workspace);
  const webTools = new WebTools();

  const tools: Tool[] = [
    {
      name: 'read_file',
      description: 'Read a file from the workspace',
      parameters: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
      execute: (args) => fileTools.read(args)
    },
    {
      name: 'write_file',
      description: 'Write content to a file',
      parameters: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] },
      execute: (args) => fileTools.write(args)
    },
    {
      name: 'edit_file',
      description: 'Edit a file by replacing text',
      parameters: { type: 'object', properties: { path: { type: 'string' }, oldText: { type: 'string' }, newText: { type: 'string' } }, required: ['path', 'oldText', 'newText'] },
      execute: (args) => fileTools.edit(args)
    },
    {
      name: 'list_files',
      description: 'List files in a directory',
      parameters: { type: 'object', properties: { path: { type: 'string' } } },
      execute: (args) => fileTools.list(args)
    },
    {
      name: 'delete_file',
      description: 'Delete a file',
      parameters: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
      execute: (args) => fileTools.delete(args)
    },
    {
      name: 'run_command',
      description: 'Run a shell command',
      parameters: { type: 'object', properties: { command: { type: 'string' }, cwd: { type: 'string' }, timeout: { type: 'number' } }, required: ['command'] },
      execute: (args) => terminalTools.run(args)
    },
    {
      name: 'run_background',
      description: 'Run a background process',
      parameters: { type: 'object', properties: { command: { type: 'string' }, cwd: { type: 'string' } }, required: ['command'] },
      execute: (args) => terminalTools.runBackground(args)
    },
    {
      name: 'web_search',
      description: 'Search the web',
      parameters: { type: 'object', properties: { query: { type: 'string' }, maxResults: { type: 'number' } }, required: ['query'] },
      execute: (args) => webTools.search(args)
    },
    {
      name: 'web_fetch',
      description: 'Fetch a URL',
      parameters: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
      execute: (args) => webTools.fetch(args)
    }
  ];

  return tools;
}
