/**
 * Task queue for managing agent tasks
 */

export interface Task {
  id: string;
  prompt: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export class TaskQueue {
  private tasks: Map<string, Task> = new Map();
  private queue: string[] = [];

  add(prompt: string): Task {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: Task = {
      id,
      prompt,
      status: 'pending',
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    this.queue.push(id);
    return task;
  }

  get(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  getAll(): Task[] {
    return Array.from(this.tasks.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  update(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    Object.assign(task, updates);
    if (updates.status === 'completed' || updates.status === 'failed') {
      task.completedAt = new Date();
    }
    return task;
  }

  remove(id: string): boolean {
    return this.tasks.delete(id);
  }

  clear() {
    this.tasks.clear();
    this.queue = [];
  }
}
