/**
 * Plugin Registry - inspired by DeepSeek Harness
 * Everything is a plugin
 */

export interface Plugin {
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  tools?: any[];
  initialize?: (ctx: PluginContext) => Promise<void>;
  dispose?: () => Promise<void>;
}

export interface PluginContext {
  workspace: string;
  agent: any;
  config: Record<string, any>;
}

export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();
  private contexts: Map<string, PluginContext> = new Map();

  register(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already registered`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  async initialize(ctx: PluginContext) {
    for (const [name, plugin] of this.plugins) {
      this.contexts.set(name, ctx);
      if (plugin.initialize) {
        await plugin.initialize(ctx);
      }
    }
  }

  async disposeAll() {
    for (const [name, plugin] of this.plugins) {
      if (plugin.dispose) {
        await plugin.dispose();
      }
    }
    this.plugins.clear();
    this.contexts.clear();
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getByCapability(capability: string): Plugin[] {
    return this.getAll().filter(p => p.capabilities.includes(capability));
  }
}

export const registry = new PluginRegistry();
