# 🚀 Quick Start Guide - AI Features

## 5-Minute Setup

### Step 1: Get Your API Key (Optional but Recommended)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your key

### Step 2: Configure
```bash
# In your project directory
echo "GEMINI_API_KEY=your-api-key-here" >> .env
```

**Note**: All features work WITHOUT an API key using smart fallbacks!

### Step 3: Start the Server
```bash
npm run dev
```

---

## 🎯 Try Your First AI Feature (30 seconds)

### Smart Commit Messages

1. **Make a change** to any file
2. **Open Git Panel** (left sidebar)
3. **Select files** to commit
4. **Click the ✨ sparkle button** in commit message box
5. **Watch AI generate** a perfect commit message!

```
Example output:
feat(ui): Add dark mode toggle component
```

---

## 🛡️ Try Code Review (1 minute)

1. **Select files** in Git Panel
2. **Click purple "Review" button**
3. **Wait 3-5 seconds** for AI analysis
4. **View your score** (1-10) and suggestions
5. **Fix issues** before committing!

**You'll see:**
- Quality score with color coding
- Potential bugs and warnings
- Best practice suggestions
- Celebration for perfect code! 🎉

---

## 📊 Try Complexity Analysis (30 seconds)

1. **Open any code file** (JS, JSX, TS, TSX, PY, etc.)
2. **Open Complexity Panel** (if integrated in your sidebar)
3. **See instant metrics**:
   - Lines of code
   - Cyclomatic complexity
   - Cognitive complexity
   - Maintainability score
4. **Get recommendations** for improvement

**Color Codes:**
- 🟢 Green = Good (Low complexity)
- 🟡 Yellow = OK (Medium complexity)
- 🔴 Red = Refactor needed (High complexity)

---

## ⚡ Try Quick Actions (15 seconds)

1. **Modify any file**
2. **Look at bottom-center** of screen
3. **See floating action button** or expanded bar
4. **Click any action** for instant execution

**Example actions you'll see:**
- 📝 Commit this file
- 🔍 Review changes
- 📊 Analyze complexity
- 🧪 Create test file

---

## 🏆 Check Your Achievements (30 seconds)

1. **Look for achievement icon** in header (trophy)
2. **Click to open** achievement panel
3. **See your progress** toward 9 achievements
4. **Track stats**: commits, streak, clean code count

**First achievements:**
- 🎯 Make your first commit
- 🌅 Commit before 8 AM (Early Bird)
- 🦉 Commit after 10 PM (Night Owl)

---

## 💡 Pro Tips

### Get the Most Out of AI Features

1. **Review Before Committing**
   - Always click Review before big commits
   - Fix "error" and "warning" level issues
   - Learn from suggestions

2. **Use Smart Commits**
   - Generate message, then personalize
   - Add ticket numbers or context
   - Edit AI suggestions to fit your style

3. **Track Complexity**
   - Check metrics on complex functions
   - Refactor when scores are red
   - Aim for maintainability > 80

4. **Quick Actions Workflow**
   - Let actions guide your workflow
   - Use shortcuts for common tasks
   - Minimize context switching

5. **Pursue Achievements**
   - Set personal goals
   - Track your progress
   - Celebrate milestones!

---

## 🔧 Troubleshooting

### AI Features Not Working?

**Check this checklist:**
- ✅ API key in `.env` file (or use fallback features)
- ✅ Server restarted after adding key
- ✅ Internet connection active
- ✅ Browser console for errors (F12)

### Features Work Without API Key!
All features have intelligent fallbacks:
- **Commits**: Rule-based generation
- **Review**: Static code analysis
- **Complexity**: Always calculated locally
- **Actions**: Pattern-based suggestions

---

## 🎨 Customize Your Experience

### Adjust Complexity Thresholds
Edit `/server/services/aiService.js`:
```javascript
// Change thresholds
const thresholds = {
  cyclomaticComplexity: 15, // default
  cognitiveComplexity: 10,  // default
  linesOfCode: 300          // default
};
```

### Add Custom Achievements
Edit `/src/components/AchievementSystem.jsx`:
```javascript
// Add your own achievement
{
  id: 'your-achievement',
  name: 'Your Title',
  description: 'Your description',
  icon: '🎯',
  unlocked: /* your condition */,
  rarity: 'epic'
}
```

### Customize Quick Actions
Edit `/src/components/QuickActionsBar.jsx`:
```javascript
// Add custom action
newActions.push({
  id: 'your-action',
  label: 'Your Action',
  icon: YourIcon,
  color: 'bg-blue-500',
  action: () => onAction('your-action'),
  priority: 'high'
});
```

---

## 📱 Mobile Experience

All features work on mobile:
- **Commit messages**: Tap sparkle icon
- **Code review**: Tap review button
- **Complexity**: Swipe to panel
- **Quick actions**: Floating button at bottom
- **Achievements**: Tap trophy icon

Responsive design ensures perfect experience on any device!

---

## 🎓 Learning Resources

### Understanding the Code
1. **Backend Logic**: `/server/services/aiService.js`
2. **UI Components**: `/src/components/`
3. **API Routes**: `/server/routes/git.js`

### Documentation
- **Full Guide**: `AI_FEATURES.md`
- **Summary**: `AI_FEATURES_SUMMARY.md`
- **This Guide**: `QUICK_START_AI.md`

### Getting Help
- Check browser console (F12) for errors
- Review documentation files
- Test with simple examples first
- Verify API key configuration

---

## 🚀 Next Steps

### After Setup, Try:
1. ✅ Generate 3 commit messages
2. ✅ Run code review on a file
3. ✅ Check complexity of your code
4. ✅ Use quick actions 5 times
5. ✅ Unlock your first achievement

### Advanced Usage:
- Integrate with your CI/CD
- Set up team coding standards
- Track metrics over time
- Customize for your workflow

---

## 🎉 You're Ready!

You now have:
- ✅ AI commit messages
- ✅ Code review assistant
- ✅ Complexity analyzer
- ✅ Quick actions
- ✅ Achievement system

**Time to level up your coding game!** 🚀

---

## 💬 Feedback

Love a feature? Found a bug? Have suggestions?
- Open an issue on GitHub
- Contribute improvements
- Share your experience

---

**Happy Coding with AI! 🤖✨**

*Remember: AI is your assistant, not your replacement. Use it to learn, improve, and code better!*
