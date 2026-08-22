/**
 * File manager for agent operations
 */

import fs from 'fs/promises';
import path from 'path';

export class FileManager {
  constructor(private workspace: string) {}

  async readFile(filePath: string): Promise<string> {
    const fullPath = path.join(this.workspace, filePath);
    return fs.readFile(fullPath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.workspace, filePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  async editFile(filePath: string, oldText: string, newText: string): Promise<string> {
    const content = await this.readFile(filePath);
    if (!content.includes(oldText)) {
      throw new Error('Old text not found in file');
    }
    const newContent = content.replace(oldText, newText);
    await this.writeFile(filePath, newContent);
    return `Edited ${filePath}`;
  }

  async listFiles(dir: string = ''): Promise<string[]> {
    const fullPath = path.join(this.workspace, dir);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    return entries.map(e => path.join(dir, e.name));
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(path.join(this.workspace, filePath));
      return true;
    } catch {
      return false;
    }
  }
}
