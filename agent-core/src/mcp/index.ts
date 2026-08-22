/**
 * Freecode.fun MCP Server
 * Exposes agent tools via Model Context Protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AgentEngine, AgentConfig } from '../engine.js';
import { getAllTools } from '../tools.js';

export class FreecodeFunMCPServer {
  private server: Server;
  private agent: AgentEngine;

  constructor(workspace: string, providerUrl: string, apiKey?: string) {
    this.server = new Server(
      {
        name: 'freecode.fun-agent',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    const config: AgentConfig = {
      workspace,
      providerUrl,
      apiKey,
      model: 'auto',
      maxIterations: 50
    };
    this.agent = new AgentEngine(config);

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = getAllTools(this.agent['config'].workspace);
      return {
        tools: tools.map(t => ({
          name: t.name,
          description: t.description,
          inputSchema: t.parameters
        }))
      };
    });

    // Execute tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        // Execute task with the tool call context
        const result = await this.agent.executeTask(
          `User wants to: ${name} with args ${JSON.stringify(args)}. Execute this tool and return the result.`
        );
        
        return {
          content: [
            {
              type: 'text',
              text: result.output || result.error || 'Tool executed'
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
