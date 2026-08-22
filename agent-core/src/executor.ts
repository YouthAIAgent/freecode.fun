/**
 * Code executor for running shell commands
 */

import { spawn } from 'child_process';

export interface ExecResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
}

export class CodeExecutor {
  constructor(private workspace: string) {}

  async run(command: string, cwd?: string): Promise<ExecResult> {
    return new Promise((resolve) => {
      const workdir = cwd || this.workspace;
      const [cmd, ...args] = command.split(' ');
      
      const proc = spawn(cmd, args, {
        cwd: workdir,
        shell: true,
        timeout: 60000
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        resolve({
          success: code === 0,
          output: stdout.trim(),
          error: stderr.trim() || undefined,
          exitCode: code || 0
        });
      });

      proc.on('error', (err) => {
        resolve({
          success: false,
          output: '',
          error: err.message,
          exitCode: -1
        });
      });
    });
  }

  async runPython(code: string): Promise<ExecResult> {
    return this.run(`python3 -c "${code.replace(/"/g, '\\"')}"`);
  }

  async runNode(code: string): Promise<ExecResult> {
    return this.run(`node -e "${code.replace(/"/g, '\\"')}"`);
  }
}
