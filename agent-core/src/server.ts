/**
 * Standalone HTTP server for the agent
 * Can be used by desktop/mobile apps
 */

import express from 'express';
import cors from 'cors';
import { AgentEngine } from './engine.js';
import { getAllTools } from './tools.js';

export function createAgentServer(workspace: string, providerUrl: string, apiKey?: string) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const agent = new AgentEngine({ workspace, providerUrl, apiKey });

  // Execute task
  app.post('/agent/execute', async (req, res) => {
    try {
      const { prompt, maxIterations } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const result = await agent.executeTask(prompt);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get agent history
  app.get('/agent/history', (req, res) => {
    res.json({ history: agent.getHistory() });
  });

  // Clear history
  app.post('/agent/clear', (req, res) => {
    agent.clearHistory();
    res.json({ success: true });
  });

  // List available tools
  app.get('/agent/tools', (req, res) => {
    const tools = getAllTools(workspace);
    res.json({ tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters
    })) });
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', agent: 'freecode.fun' });
  });

  return app;
}
