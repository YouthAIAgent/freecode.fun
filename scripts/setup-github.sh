#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "=== Freecode.fun GitHub Setup ==="
echo ""

# Check git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git not installed. Run: pkg install git"
    exit 1
fi

# Get user info
read -p "GitHub username: " GITHUB_USER
read -p "Repository name [freecode.fun]: " REPO_NAME
REPO_NAME=${REPO_NAME:-freecode.fun}

# Configure git
echo ""
echo "Configuring git..."
git config --global user.name "Chiranjib"
git config --global user.email "myai@nousresearch.com"

# Update remote
echo "Updating git remote..."
git remote remove origin 2>/dev/null || true

echo ""
echo "Choose authentication method:"
echo "1) SSH (git@github.com:...)"
echo "2) HTTPS with PAT (https://<TOKEN>@github.com/...)"
read -p "Enter choice [1-2]: " AUTH_CHOICE

if [ "$AUTH_CHOICE" = "2" ]; then
    read -p "Enter GitHub PAT: " GITHUB_TOKEN
    git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
else
    git remote add origin "git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
fi

# Create branch
echo "Creating main branch..."
git checkout -b main

# Commit
echo "Committing changes..."
git add -A
git commit -m "Initial Freecode.fun platform

- Rebranded from FreeLLMAPI to Freecode.fun
- Added autonomous coding agent (agent-core)
- Android Compose app with PWA support
- Desktop Electron app (Mac/Windows)
- Plugin architecture from DeepSeek Harness
- Session persistence
- Unified proxy for 37+ LLM providers
- GitHub Actions for Android APK builds"

# Push
echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "=== Setup Complete ==="
echo "Repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "Next steps:"
echo "1. Go to GitHub repository"
echo "2. Check Actions tab for Android build"
echo "3. Download APK from artifacts"
