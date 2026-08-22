/**
 * Test the agent engine
 */

import { AgentEngine } from './engine.js';

async function main() {
  console.log('🧪 Testing Freecode.fun Agent Engine\n');
  
  const engine = new AgentEngine({
    workspace: '/data/data/com.termux/files/home/freecode.fun',
    providerUrl: 'http://127.0.0.1:3012',
    model: 'auto',
    maxIterations: 10
  });

  // Test 1: Simple file creation
  console.log('Test 1: Create a simple file');
  const result = await engine.executeTask('Create a file hello.txt with content "Hello from Freecode.fun!"');
  console.log('Result:', result);
  
  if (result.success) {
    console.log('✅ Test 1 passed');
  } else {
    console.log('❌ Test 1 failed:', result.error);
  }

  // Test 2: List files
  console.log('\nTest 2: List files in workspace');
  const result2 = await engine.executeTask('List all files in the current directory');
  console.log('Result:', result2);
}

main().catch(console.error);
