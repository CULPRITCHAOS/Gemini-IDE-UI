# Changelog

## [2.0.0] - 2024-12-26

### 🚀 Major AI-Powered Update

#### Added
- **Smart Commit Message Generator** - AI-powered commit messages using Gemini API with conventional commits format
- **Code Review Assistant** - Pre-commit AI code review with quality scoring (1-10), issue detection, and suggestions
- **Code Complexity Analyzer** - Real-time analysis of cyclomatic complexity, cognitive complexity, and maintainability scores
- **Quick Actions Bar** - Context-aware floating action bar with smart suggestions
- **Achievement System** - Gamification with 9 unique achievements across 5 rarity tiers
- **AI Service Module** - Centralized AI service with intelligent fallbacks when API key is not configured
- **New API Endpoints**:
  - `/api/git/review-changes` - AI code review
  - `/api/git/analyze-complexity` - Code complexity metrics
- **Beautiful UI Components**:
  - CodeReviewModal with gradient headers and animated transitions
  - ComplexityPanel with visual metrics and recommendations
  - QuickActionsBar with context-aware suggestions
  - AchievementSystem with progress tracking
- **Comprehensive Documentation** - New AI_FEATURES.md with detailed feature documentation

#### Enhanced
- **Git Panel** - Added Review button with AI code review integration
- **Commit Message Generation** - Enhanced with Gemini AI (previously rule-based only)
- **Error Handling** - Graceful fallbacks when AI is unavailable
- **Dark Mode Support** - All new components fully support dark mode
- **Responsive Design** - All new features work seamlessly on mobile

#### Technical Improvements
- Modular AI service architecture
- Caching and optimization for AI calls
- Rule-based fallbacks for offline/no-API-key scenarios
- Performance optimized with lazy loading

### Breaking Changes
- None - fully backward compatible

### Migration Guide
- Optional: Add `GEMINI_API_KEY` to `.env` for full AI features
- All features work without API key using intelligent fallbacks

## [1.5.0] - 2025-07-15

### 追加
- Gemini 2.5 Proモデルのサポート
- モデル選択機能（設定画面から選択可能）
- YOLOモード（--yoloフラグ対応）
- チャット画面にモデル表示
- 画像添付機能の改善
- 日本語README

### 変更
- Claude CLI UIからGemini CLI UIへの移行
- デフォルトモデルをgemini-2.5-proに変更
- UIの各種ブランディング更新
- 不要なデバッグログの削除

### 修正
- チャット入力欄の配置問題
- レイアウトの初期読み込み時の崩れ
- セッション管理の改善

### 削除
- Claude関連のファイルとコンポーネント
- MCP Servers機能（一時的に）
- 不要なデバッグログ出力