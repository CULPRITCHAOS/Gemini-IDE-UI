# 📱 Mobile Terminal Guide

## Complete Guide to Using the Terminal on Mobile

---

## 🎯 Overview

The Gemini CLI UI terminal is fully optimized for mobile devices with touch gestures, quick actions, and adaptive font sizing. This guide will help you master mobile terminal usage.

---

## ✨ Mobile Features

### 1. 📱 Responsive Design
- **Auto-detection**: Automatically detects mobile devices
- **Optimized font size**: Starts at 12px on mobile (vs 14px desktop)
- **Touch-friendly buttons**: Larger touch targets for easy tapping
- **Condensed spacing**: Efficient use of screen space

### 2. 👆 Touch Gestures

#### Double-Tap Gesture
**Action**: Double-tap anywhere on the terminal  
**Result**: Toggles the mobile quick actions toolbar

```
👆👆 = Toggle Toolbar
```

#### Pinch to Zoom
The terminal supports native browser pinch-to-zoom:
- **Pinch out**: Zoom in for better readability
- **Pinch in**: Zoom out to see more content
- **Note**: Use font size controls in toolbar for persistent changes

### 3. 🔧 Mobile Quick Actions Toolbar

Access via double-tap or toolbar button. Includes:

#### File Operations
- **ls** - List files and directories
  ```bash
  Runs: ls -la
  ```

#### Navigation
- **pwd** - Print working directory
  ```bash
  Runs: pwd
  ```

#### Git Commands
- **git** - Quick git status check
  ```bash
  Runs: git status
  ```

#### Terminal Management
- **Clear** - Clear terminal screen
  - Removes all output
  - Fresh start for new commands

### 4. 🔤 Font Size Controls

Located in the quick actions toolbar:

- **[-]** button: Decrease font size (minimum: 8px)
- **Current size display**: Shows current font size (e.g., "12px")
- **[+]** button: Increase font size (maximum: 24px)

**Pro Tip**: Find your optimal font size based on:
- Device screen size
- Reading distance
- Vision comfort
- Amount of information needed on screen

---

## 🚀 Quick Start Guide

### Step 1: Open Terminal
1. Select your project from the sidebar
2. Tap the **Shell** tab in the navigation bar
3. Tap **"Continue in Shell"** button

### Step 2: Enable Mobile Toolbar
**Option A**: Double-tap anywhere on the terminal  
**Option B**: Tap the toolbar button (⚙️) in the header

### Step 3: Adjust Font Size (Optional)
1. Open the mobile toolbar
2. Use **[-]** and **[+]** buttons to adjust
3. View real-time changes in terminal

### Step 4: Use Quick Actions
- Tap any quick action button
- Command executes immediately
- View results in terminal

---

## 💡 Mobile Terminal Tips & Tricks

### Tip 1: Landscape Mode for More Space
Rotate your device to landscape orientation for:
- ✅ Wider terminal view
- ✅ More characters per line
- ✅ Better code readability
- ✅ Easier command editing

### Tip 2: External Keyboard Support
Connect a Bluetooth keyboard for:
- ⌨️ Faster typing
- ⌨️ Standard keyboard shortcuts (Ctrl+C, Ctrl+V)
- ⌨️ Better cursor navigation
- ⌨️ Tab completion

### Tip 3: Voice Input (Browser Feature)
Some mobile browsers support voice input:
1. Tap in terminal input area
2. Look for microphone icon on keyboard
3. Speak your command
4. Review and submit

### Tip 4: Copy & Paste
**To Copy**:
1. Long-press on terminal text
2. Select text using handles
3. Tap "Copy" from context menu

**To Paste**:
1. Long-press in input area
2. Tap "Paste" from context menu
3. Or use Ctrl+V with external keyboard

### Tip 5: Split Screen Multitasking (Tablet)
On supported devices:
1. Open Gemini CLI UI
2. Enable split-screen mode (device-specific)
3. Open documentation or reference in other half
4. Work efficiently with both visible

---

## 🎮 Common Terminal Tasks on Mobile

### Task 1: Navigate Project Files
```bash
# List all files
ls -la

# Change directory
cd src/

# Go back
cd ..

# View current location
pwd
```

### Task 2: Check Git Status
```bash
# Quick status
git status

# Detailed diff
git diff

# View log
git log --oneline

# Check branches
git branch
```

### Task 3: Run Build Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Task 4: File Operations
```bash
# Create file
touch newfile.js

# Create directory
mkdir new-folder

# Remove file
rm oldfile.js

# Move/rename
mv old.js new.js
```

### Task 5: View File Contents
```bash
# Display file
cat README.md

# View with pagination
less package.json

# View first lines
head -n 20 file.js

# View last lines
tail -f logs.txt
```

---

## 🔋 Battery & Performance Optimization

### Keep Terminal Responsive
1. **Close when not in use**: Disconnect from shell to save resources
2. **Avoid long-running processes**: Use chat interface for long AI operations
3. **Clear output regularly**: Use Clear button to free memory
4. **Limit scrollback**: Terminal history is limited to 10,000 lines

### Battery Saving Tips
- 🔋 **Reduce brightness**: Lower screen brightness when coding
- 🔋 **Use dark theme**: OLED screens use less power with dark backgrounds
- 🔋 **Close unnecessary tabs**: Focus on current project only
- 🔋 **Airplane mode + WiFi**: Disable cellular when on WiFi

---

## 🎨 Customization

### Terminal Theme
The terminal uses a carefully crafted dark theme optimized for mobile:
- **Background**: `#1e1e1e` (dark gray, easy on eyes)
- **Foreground**: `#d4d4d4` (light gray, good contrast)
- **Cursor**: White for visibility
- **Full ANSI color support**: 16 colors + 256-color palette

### Font Settings
Current mobile defaults:
```javascript
{
  fontSize: 12,           // Optimized for mobile
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  lineHeight: 1.2,        // Compact for mobile
  letterSpacing: 0,       // Standard spacing
  cursorBlink: true,      // Visible cursor
  scrollback: 10000       // History lines
}
```

---

## 🐛 Troubleshooting

### Issue: Terminal not responding to taps
**Solution**: 
- Ensure JavaScript is enabled
- Refresh the page
- Check internet connection
- Try disconnecting and reconnecting

### Issue: Double-tap not working
**Solution**:
- Tap more quickly (< 300ms between taps)
- Tap in the terminal area (not header)
- Use toolbar button as alternative

### Issue: Font too small/large
**Solution**:
- Open mobile toolbar (double-tap)
- Adjust font size with +/- buttons
- Or use browser zoom (pinch gesture)

### Issue: Can't see toolbar
**Solution**:
- Double-tap terminal to show
- Look for toolbar button in header
- Ensure you're connected to shell

### Issue: Quick actions not working
**Solution**:
- Ensure terminal is connected (green dot)
- Check if command is running (wait for prompt)
- Try manual command entry

### Issue: Keyboard covering terminal
**Solution**:
- Scroll up to see output
- Use landscape mode for more space
- Quick actions toolbar auto-hides when typing

---

## 📱 Device-Specific Features

### iOS (iPhone/iPad)
- **3D Touch**: Firm press for context menu
- **Split View**: iPad supports split-screen with other apps
- **Shortcuts**: Create Siri shortcuts for quick access
- **Files App**: Direct access to project files

### Android
- **Split Screen**: Most devices support split-screen mode
- **Quick Settings**: Add tile for quick app launch
- **Widgets**: Consider adding home screen widget (future)
- **Termux Integration**: Advanced users can integrate with Termux

---

## 🎓 Advanced Mobile Terminal Usage

### 1. Session Management
```bash
# Start named session
gemini --session my-feature

# Resume session
gemini --resume session-id

# List sessions
ls ~/.gemini/projects/
```

### 2. Command History
Use arrow keys (external keyboard) or:
- **Up arrow**: Previous command
- **Down arrow**: Next command
- **Ctrl+R**: Search history

### 3. Tab Completion
With external keyboard:
- **Tab**: Auto-complete filenames
- **Tab Tab**: Show all possibilities

### 4. Multiple Commands
```bash
# Chain commands
cd src && ls -la && git status

# Run in sequence
npm install; npm run build; npm test
```

### 5. Background Jobs
```bash
# Run in background
npm run dev &

# List jobs
jobs

# Bring to foreground
fg
```

---

## 🔐 Security on Mobile

### Best Practices
1. **Lock device when away**: Use PIN/biometric lock
2. **Use secure WiFi**: Avoid public WiFi for sensitive work
3. **VPN recommended**: Use VPN on public networks
4. **Keep app updated**: Install updates promptly
5. **Review permissions**: Only grant necessary permissions

### Authentication
- Terminal uses your login session
- Token stored securely in browser
- Auto-logout after inactivity (configurable)
- Re-authentication required after device restart

---

## 📊 Mobile Terminal Shortcuts Cheat Sheet

| Action | Method | Result |
|--------|--------|--------|
| Toggle toolbar | Double-tap terminal | Show/hide quick actions |
| Increase font | Tap [+] button | Larger text |
| Decrease font | Tap [-] button | Smaller text |
| List files | Tap "ls" button | Show directory contents |
| Clear screen | Tap "Clear" button | Fresh terminal |
| Show path | Tap "pwd" button | Display current directory |
| Git status | Tap "git" button | Show git status |
| Copy text | Long-press → Copy | Copy to clipboard |
| Paste text | Long-press → Paste | Paste from clipboard |
| Disconnect | Tap Disconnect button | Close shell connection |
| Restart | Tap Restart button | Fresh terminal session |

---

## 🎯 Mobile Terminal Workflows

### Workflow 1: Quick Bug Fix
```
1. Open app → Select project
2. Switch to Shell tab
3. Connect to shell
4. Run: git status
5. Edit file in Files tab
6. Return to Shell
7. Run: git add . && git commit -m "fix: bug"
8. Run: git push
9. Disconnect
```

### Workflow 2: Check Build Status
```
1. Open app → Recent project
2. Shell tab → Connect
3. Double-tap for toolbar
4. Tap "git" to check status
5. Run: npm run build
6. View build output
7. Test in Preview tab
8. Disconnect when done
```

### Workflow 3: Mobile Code Review
```
1. Connect to shell
2. Run: git diff main..feature-branch
3. Review changes in terminal
4. Switch to Files tab for editing
5. Return to Shell for git commands
6. Commit and push approved changes
```

---

## 🌟 Pro Tips from Mobile Developers

### Tip 1: Use Custom Commands
Create aliases for frequently used commands:
```bash
# Add to ~/.bashrc or ~/.zshrc
alias gs='git status'
alias gp='git pull'
alias gc='git commit -m'
alias build='npm run build'
```

### Tip 2: Mobile-Friendly Command Output
Format output for mobile screens:
```bash
# Limit width
ls -1  # One file per line
git log --oneline  # Compact log
df -h | column -t  # Aligned columns
```

### Tip 3: Quick Navigation
Use shortcuts to move faster:
```bash
cd -     # Go to previous directory
cd ~     # Go to home
cd       # Also goes to home
cd ../.. # Go up two levels
```

### Tip 4: Use the File Explorer
For complex file operations:
1. Use Files tab instead of terminal
2. Visual interface for file management
3. Syntax highlighting for viewing
4. Direct file editing

### Tip 5: Combine with AI Chat
For complex tasks:
1. Ask AI in Chat tab
2. Get command suggestions
3. Copy to Shell tab
4. Execute with confidence

---

## 🚀 What's Next?

### Planned Mobile Terminal Features
- [ ] **Custom quick action buttons** - Add your own commands
- [ ] **Command snippets library** - Save and reuse common commands
- [ ] **Voice commands** - Execute commands by voice
- [ ] **Gesture customization** - Configure your own gestures
- [ ] **Terminal themes** - Choose from multiple color schemes
- [ ] **Split terminal view** - Multiple terminal sessions
- [ ] **Command history search** - Visual command history
- [ ] **Auto-complete improvements** - Better mobile autocomplete

### Your Feedback Matters!
Have ideas for mobile terminal improvements?
- Open an issue on GitHub
- Join our Discord community
- Submit a pull request
- Share your mobile workflow

---

## 📞 Get Help

### Resources
- **Documentation**: `/MOBILE_GUIDE.md` - General mobile features
- **Android APK**: `/ANDROID_APK_GUIDE.md` - Convert to native app
- **Main README**: `/README.md` - Full project documentation

### Community
- **GitHub Issues**: Report bugs and request features
- **Discord**: Real-time help and discussions
- **Stack Overflow**: Tag your questions with `gemini-cli-ui`

### Quick Support
Common questions answered in README.md:
- How to install Gemini CLI
- How to configure API keys
- How to set up projects
- Troubleshooting guide

---

## 🎉 Happy Mobile Coding!

You now have everything you need to be productive with the terminal on your mobile device. Whether you're:

- 🚇 **Commuting**: Quick fixes on the go
- ☕ **At a café**: Build and deploy your app
- 🏖️ **On vacation**: Emergency hotfixes
- 🛋️ **On the couch**: Weekend coding sessions
- ✈️ **Flying**: Offline development

The mobile terminal has you covered! 📱✨

---

**"The best development environment is the one in your pocket."** 🚀
