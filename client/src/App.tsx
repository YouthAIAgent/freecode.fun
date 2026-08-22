import { useState, useEffect } from 'react';
import './index.css';

type Message = { role: 'user' | 'assistant'; content: string };

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('auto');
  const [serverUrl, setServerUrl] = useState('http://127.0.0.1:3012');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const send = async () => {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: 'user' as const, content: input }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: next, max_tokens: 1024 })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No response';
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setMessages([...next, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0b0d12', color: '#e6e6e6' }}>
      {sidebarOpen && (
        <aside style={{ width: 260, borderRight: '1px solid #1b1f27', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Freecode.fun</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Autonomous Coding Agent</div>
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.7 }}>Server</label>
            <input
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              style={{ width: '100%', marginTop: 6, padding: 8, background: '#11141b', color: '#e6e6e6', border: '1px solid #1b1f27', borderRadius: 6 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{ width: '100%', marginTop: 6, padding: 8, background: '#11141b', color: '#e6e6e6', border: '1px solid #1b1f27', borderRadius: 6 }}
            >
              <option value="auto">auto</option>
              <option value="kilo-auto/free">kilo-auto/free</option>
              <option value="DeepSeek-V4-Flash-0731">DeepSeek-V4-Flash-0731</option>
              <option value="gpt-oss:20b">gpt-oss:20b</option>
              <option value="Qwen3-32B">Qwen3-32B</option>
            </select>
          </div>
          <button
            onClick={() => setMessages([])}
            style={{ marginTop: 'auto', padding: 10, background: '#1b1f27', color: '#e6e6e6', border: '1px solid #2a3040', borderRadius: 6, cursor: 'pointer' }}
          >
            New Chat
          </button>
        </aside>
      )}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: 12, borderBottom: '1px solid #1b1f27', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen((v) => !v)} style={{ background: 'transparent', border: 'none', color: '#e6e6e6', cursor: 'pointer' }}>☰</button>
          <div style={{ fontWeight: 600 }}>Freecode.fun Agent</div>
          <div style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>local router</div>
        </header>
        <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.length === 0 && (
            <div style={{ opacity: 0.7, marginTop: 120, textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>Start a coding session.</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>This client talks to your local Freecode.fun server.</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%', background: m.role === 'user' ? '#1f2937' : '#11141b', padding: 12, borderRadius: 12, border: '1px solid #1f2937' }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>{m.role}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
            </div>
          ))}
          {loading && <div style={{ opacity: 0.7 }}>Running agent…</div>}
        </div>
        <footer style={{ padding: 12, borderTop: '1px solid #1b1f27', display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask the agent to build something..."
            style={{ flex: 1, padding: 12, background: '#11141b', color: '#e6e6e6', border: '1px solid #1b1f27', borderRadius: 8 }}
          />
          <button onClick={send} disabled={loading} style={{ padding: '12px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer' }}>
            Send
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
