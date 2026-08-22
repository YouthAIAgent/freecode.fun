/**
 * Session persistence - inspired by DeepSeek Harness
 */

import fs from 'fs/promises';
import path from 'path';

export interface Session {
  id: string;
  workspace: string;
  history: Array<{role: string; content: string; tool_calls?: any}>;
  filesChanged: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export class SessionStore {
  constructor(private storagePath: string) {}

  async create(workspace: string): Promise<Session> {
    const session: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workspace,
      history: [],
      filesChanged: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {}
    };

    await this.save(session);
    return session;
  }

  async load(id: string): Promise<Session | null> {
    try {
      const filePath = path.join(this.storagePath, `${id}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
    } catch {
      return null;
    }
  }

  async save(session: Session): Promise<void> {
    await fs.mkdir(this.storagePath, { recursive: true });
    const filePath = path.join(this.storagePath, `${session.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(session, null, 2));
  }

  async update(id: string, updates: Partial<Session>): Promise<Session | null> {
    const session = await this.load(id);
    if (!session) return null;

    Object.assign(session, updates, { updatedAt: new Date() });
    await this.save(session);
    return session;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const filePath = path.join(this.storagePath, `${id}.json`);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async list(): Promise<Session[]> {
    try {
      const files = await fs.readdir(this.storagePath);
      const sessions: Session[] = [];
      
      for (const file of files.filter(f => f.endsWith('.json'))) {
        const session = await this.load(file.replace('.json', ''));
        if (session) sessions.push(session);
      }
      
      return sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch {
      return [];
    }
  }
}
