# Freecode.fun — GitHub Setup Guide

## Quick Start

Run the setup script:
```bash
cd ~/freecode.fun
bash scripts/setup-github.sh
```

## Manual Setup

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `freecode.fun`
3. Set to Public
4. Do NOT initialize with README
5. Click Create

### 2. Configure Git

```bash
cd ~/freecode.fun
git config --global user.name "Chiranjib"
git config --global user.email "myai@nousresearch.com"
```

### 3. Update Remote

```bash
# Remove old remote
git remote remove origin 2>/dev/null || true

# Add new remote (choose one)
git remote add origin git@github.com:YouthAIAgent/freecode.fun.git
# OR
git remote add origin https://<TOKEN>@github.com/YouthAIAgent/freecode.fun.git
```

### 4. Commit and Push

```bash
git checkout -b main
git add -A
git commit -m "Initial Freecode.fun platform"
git push -u origin main
```

## After Push

### GitHub Actions Builds

The workflow `.github/workflows/android-build.yml` will:
- Build Android APK automatically
- Upload to GitHub Actions artifacts
- Takes approximately 5-10 minutes

### Download APK

1. Go to repository Actions tab
2. Click latest workflow run
3. Download APK artifact
4. Install on Android device

## Platforms

- Android: APK via GitHub Actions
- Web: http://localhost:5173
- Desktop: npm run desktop:dist for Mac or Windows
- PWA: Install from browser

## Features

- Autonomous coding agent
- 37-plus LLM providers
- Plugin architecture
- Session persistence
- Voice I/O ready
- Git integration
- Project templates

## License

MIT — fork, modify, distribute freely.
