# Freecode.fun - Autonomous Coding Agent Platform

## 🎯 Vision
Freecode.fun = Free Large Language Model API + Autonomous Coding Agent
- One-time install, forever free coding
- Android, Windows, Mac apps
- Autonomous agent like Claude Code Desktop
- 100% free, open source

## 📊 Current Status

### ✅ Completed
1. **Forked FreeLLMAPI** (MIT License)
   - Location: ~/freecode.fun
   - Base: v0.2.1 (latest)
   - Rebranded to Freecode.fun

2. **Agent Core Architecture**
   - `agent-core/src/engine.ts` - Main agent engine
   - `agent-core/src/task-queue.ts` - Task management
   - `agent-core/src/file-manager.ts` - File operations
   - `agent-core/src/executor.ts` - Code execution
   - `agent-core/src/provider-router.ts` - LLM routing

3. **App Scaffolding**
   - Desktop app: rebranded, ready to build
   - Android app: basic screens created
   - Windows/Mac: same Electron base as desktop

4. **Provider Integration**
   - 37+ providers from FreeLLMAPI
   - 7 working anonymous endpoints
   - Unified proxy on port 3012

## 🏗️ Architecture

```
Freecode.fun/
├── server/              # FreeLLMAPI server (MIT)
│   └── src/
│       ├── routes/      # API endpoints
│       ├── providers/   # 37+ LLM providers
│       └── services/    # Health, catalog, routing
├── agent-core/          # NEW: Autonomous agent
│   └── src/
│       ├── engine.ts    # Main agent loop
│       ├── task-queue.ts # Task management
│       ├── file-manager.ts # File ops
│       ├── executor.ts  # Shell/code execution
│       └── provider-router.ts # LLM calls
├── client/              # Web dashboard
├── desktop/             # Electron app (Mac/Windows)
├── android/             # NEW: Android app
│   └── app/src/main/
│       ├── MainActivity.kt
│       ├── ChatScreen.kt
│       ├── ModelsScreen.kt
│       ├── SettingsScreen.kt
│       └── AgentService.kt
├── cli/                 # Command-line interface
└── shared/              # Shared types
```

## 🚀 Next Steps

### Phase 1: Core Agent (Week 1-2)
- [ ] Implement tool calling system
- [ ] Add file system tools (read, write, edit)
- [ ] Add terminal execution tools
- [ ] Add web search integration
- [ ] Implement context management
- [ ] Add error recovery

### Phase 2: App Integration (Week 3-4)
- [ ] Desktop: Connect agent to UI
- [ ] Android: Full Compose UI + AgentService
- [ ] Windows: Build installer
- [ ] Mac: Build DMG
- [ ] Auto-update mechanism

### Phase 3: Advanced Features (Week 5-8)
- [ ] Multi-modal support (images, files)
- [ ] Voice input/output
- [ ] Code review agent
- [ ] Test runner integration
- [ ] Git integration
- [ ] Project templates

## 🔧 Build Commands

### Desktop (Mac/Windows)
```bash
cd ~/freecode.fun
npm install
npm run build -w client
npm install --prefix desktop
npm run desktop:dist        # Mac
npm run desktop:dist:win    # Windows
```

### Android
```bash
cd ~/freecode.fun/android
./gradlew assembleDebug
```

### Server
```bash
cd ~/freecode.fun
npm install
npm run dev
```

## 📦 Distribution

1. **GitHub Releases** - Desktop apps, Android APK
2. **Google Play** - Android app
3. **Homebrew** - Mac (`brew install freecode.fun`)
4. **Winget** - Windows (`winget install freecode.fun`)
5. **Direct download** - freecode.fun website

## 🎯 Competitive Advantage

| Feature | Freecode.fun | Claude Code | Cursor | Copilot |
|---------|--------------|-------------|--------|---------|
| Price | Free | $20/mo | $20/mo | $10/mo |
| Offline | ✅ | ❌ | ❌ | ❌ |
| Self-hosted | ✅ | ❌ | ❌ | ❌ |
| Multi-platform | ✅ | ❌ | ✅ | ✅ |
| Open source | ✅ | ❌ | ❌ | ❌ |
| Anonymous use | ✅ | ❌ | ❌ | ❌ |

## 📝 License
MIT License - Free to use, modify, distribute
