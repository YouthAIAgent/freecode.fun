/**
 * File System Plugin
 */

import { Plugin, PluginContext } from '../plugin-registry.js';

export const FileSystemPlugin: Plugin = {
  name: 'filesystem',
  version: '1.0.0',
  description: 'File system operations',
  capabilities: ['read', 'write', 'edit', 'list', 'delete'],
  
  async initialize(ctx: PluginContext) {
    console.log('[FileSystemPlugin] Initialized');
  },
  
  async dispose() {
    console.log('[FileSystemPlugin] Disposed');
  }
};

export const TerminalPlugin: Plugin = {
  name: 'terminal',
  version: '1.0.0',
  description: 'Terminal/shell execution',
  capabilities: ['exec', 'spawn', 'background'],
  
  async initialize(ctx: PluginContext) {
    console.log('[TerminalPlugin] Initialized');
  },
  
  async dispose() {
    console.log('[TerminalPlugin] Disposed');
  }
};

export const WebPlugin: Plugin = {
  name: 'web',
  version: '1.0.0',
  description: 'Web search and fetch',
  capabilities: ['search', 'fetch', 'scrape'],
  
  async initialize(ctx: PluginContext) {
    console.log('[WebPlugin] Initialized');
  },
  
  async dispose() {
    console.log('[WebPlugin] Disposed');
  }
};
