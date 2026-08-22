# Android Build Guide

## Option 1: GitHub Actions (Recommended)

1. Push code to GitHub
2. GitHub Actions will automatically build the APK
3. Download from GitHub Actions artifacts

## Option 2: Build on Desktop/Mac/Windows

### Prerequisites
- Android Studio installed
- JDK 17+
- Android SDK API 34

### Build Steps
```bash
cd ~/freecode.fun/android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

## Option 3: Cloud Build Services

- **GitHub Actions**: Free for public repos
- **GitLab CI**: Free for public repos
- **Bitrise**: Free tier available
- **Codemagic**: Free for open source

## Note
Building Android apps on Termux/Android is not recommended due to:
- Missing Android SDK tools
- Resource constraints
- Complex setup

Use GitHub Actions or a desktop machine instead.
