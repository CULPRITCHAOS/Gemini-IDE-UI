import { GoogleGenerativeAI } from '@google/generative-ai';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Initialize Gemini AI
let genAI = null;
let model = null;

function initializeAI() {
  // Try to get API key from environment or gemini CLI config
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    console.log('✓ AI Service initialized with Gemini API');
    return true;
  }
  
  console.log('ℹ AI Service: No API key found. Smart features will use rule-based alternatives.');
  return false;
}

// Initialize on module load
const aiAvailable = initializeAI();

/**
 * Generate a smart commit message based on git diff
 */
export async function generateSmartCommitMessage(files, combinedDiff, projectPath) {
  if (!aiAvailable || !model) {
    // Fallback to rule-based generation
    return generateRuleBasedCommitMessage(files, combinedDiff);
  }

  try {
    const prompt = `You are an expert at writing clear, concise git commit messages following conventional commit standards.

Analyze the following code changes and generate a commit message.

Files changed: ${files.join(', ')}

Diff:
${combinedDiff.substring(0, 3000)} ${combinedDiff.length > 3000 ? '...(truncated)' : ''}

Generate a commit message that:
1. Follows conventional commits format: type(scope): description
2. Types: feat, fix, docs, style, refactor, perf, test, chore
3. Keep it under 72 characters
4. Be specific about what changed, not how
5. Use imperative mood (Add, Fix, Update, not Added, Fixed)

Return ONLY the commit message, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const message = response.text().trim();
    
    // Clean up the message (remove quotes, extra formatting)
    return message.replace(/^["']|["']$/g, '').trim();
  } catch (error) {
    console.error('AI commit message generation failed:', error.message);
    return generateRuleBasedCommitMessage(files, combinedDiff);
  }
}

/**
 * Perform code review analysis on changes
 */
export async function reviewCodeChanges(files, combinedDiff, projectPath) {
  if (!aiAvailable || !model) {
    return generateRuleBasedReview(files, combinedDiff);
  }

  try {
    const prompt = `You are an experienced code reviewer. Analyze these code changes and provide constructive feedback.

Files changed: ${files.join(', ')}

Diff:
${combinedDiff.substring(0, 4000)} ${combinedDiff.length > 4000 ? '...(truncated)' : ''}

Provide a brief review (max 200 words) focusing on:
1. Potential bugs or errors
2. Code quality issues
3. Best practice violations
4. Security concerns
5. Performance considerations

Format: Return a JSON object with:
{
  "score": <1-10>,
  "issues": [{"severity": "error|warning|info", "message": "..."}],
  "suggestions": ["..."],
  "summary": "..."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Try to parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse AI review response');
    }
    
    // Fallback to basic structure
    return {
      score: 7,
      issues: [],
      suggestions: [text],
      summary: text.substring(0, 200)
    };
  } catch (error) {
    console.error('AI code review failed:', error.message);
    return generateRuleBasedReview(files, combinedDiff);
  }
}

/**
 * Analyze code complexity metrics
 */
export async function analyzeCodeComplexity(filePath, content) {
  const metrics = {
    linesOfCode: 0,
    cyclomaticComplexity: 0,
    cognitiveComplexity: 0,
    maintainabilityScore: 100,
    issues: []
  };

  const lines = content.split('\n');
  metrics.linesOfCode = lines.filter(line => line.trim() && !line.trim().startsWith('//')).length;

  // Count control flow statements for cyclomatic complexity
  const controlFlow = content.match(/\b(if|else|for|while|switch|case|catch|\?)\b/g) || [];
  metrics.cyclomaticComplexity = controlFlow.length + 1;

  // Cognitive complexity (nested structures)
  const nested = content.match(/\{\s*\n[\s\S]*?\{/g) || [];
  metrics.cognitiveComplexity = nested.length;

  // Calculate maintainability score
  if (metrics.linesOfCode > 300) {
    metrics.maintainabilityScore -= 20;
    metrics.issues.push({ severity: 'warning', message: 'File is too large (>300 lines)' });
  }
  if (metrics.cyclomaticComplexity > 15) {
    metrics.maintainabilityScore -= 15;
    metrics.issues.push({ severity: 'warning', message: 'High cyclomatic complexity' });
  }
  if (metrics.cognitiveComplexity > 10) {
    metrics.maintainabilityScore -= 15;
    metrics.issues.push({ severity: 'warning', message: 'High cognitive complexity (deep nesting)' });
  }

  // Check for very long functions
  const longFunctions = content.match(/function[\s\S]{500,}?\}/g) || [];
  if (longFunctions.length > 0) {
    metrics.maintainabilityScore -= 10;
    metrics.issues.push({ severity: 'info', message: `${longFunctions.length} long function(s) detected` });
  }

  return metrics;
}

/**
 * Predict next files user might need
 */
export async function predictNextFiles(currentFile, recentFiles, projectStructure) {
  const predictions = [];
  
  // Extract file type and directory
  const currentExt = currentFile.split('.').pop();
  const currentDir = currentFile.split('/').slice(0, -1).join('/');
  
  // Rule 1: Related files in same directory
  if (projectStructure && projectStructure[currentDir]) {
    projectStructure[currentDir]
      .filter(f => f !== currentFile.split('/').pop())
      .slice(0, 3)
      .forEach(f => {
        predictions.push({
          file: `${currentDir}/${f}`,
          reason: 'Same directory',
          confidence: 0.7
        });
      });
  }
  
  // Rule 2: Test files
  if (!currentFile.includes('.test.') && !currentFile.includes('.spec.')) {
    const testFile = currentFile.replace(/\.([^.]+)$/, '.test.$1');
    predictions.push({
      file: testFile,
      reason: 'Test file',
      confidence: 0.8
    });
  }
  
  // Rule 3: Component and style pairs
  if (currentExt === 'jsx' || currentExt === 'tsx') {
    const styleFile = currentFile.replace(/\.(jsx|tsx)$/, '.css');
    predictions.push({
      file: styleFile,
      reason: 'Style file',
      confidence: 0.6
    });
  }
  
  // Rule 4: Index files
  const indexFile = `${currentDir}/index.${currentExt}`;
  if (currentFile !== indexFile) {
    predictions.push({
      file: indexFile,
      reason: 'Module index',
      confidence: 0.5
    });
  }
  
  // Rule 5: Recently opened files
  recentFiles.slice(0, 3).forEach((file, i) => {
    if (file !== currentFile) {
      predictions.push({
        file,
        reason: 'Recently accessed',
        confidence: 0.6 - (i * 0.1)
      });
    }
  });
  
  // Sort by confidence and return top 5
  return predictions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

/**
 * Suggest context-aware quick actions
 */
export async function suggestQuickActions(context) {
  const { currentFile, gitStatus, recentActivity } = context;
  const actions = [];
  
  // Git-related actions
  if (gitStatus && gitStatus.modified && gitStatus.modified.includes(currentFile)) {
    actions.push({
      id: 'commit-current',
      label: 'Commit this file',
      icon: 'git-commit',
      action: 'git.commitFile',
      priority: 'high'
    });
    
    actions.push({
      id: 'review-changes',
      label: 'Review changes',
      icon: 'search',
      action: 'git.reviewChanges',
      priority: 'medium'
    });
  }
  
  // File-based actions
  const ext = currentFile?.split('.').pop();
  if (ext === 'jsx' || ext === 'tsx' || ext === 'js' || ext === 'ts') {
    actions.push({
      id: 'analyze-complexity',
      label: 'Analyze complexity',
      icon: 'bar-chart',
      action: 'code.analyzeComplexity',
      priority: 'medium'
    });
    
    actions.push({
      id: 'create-test',
      label: 'Create test file',
      icon: 'test-tube',
      action: 'file.createTest',
      priority: 'low'
    });
  }
  
  // Recently active
  if (recentActivity && recentActivity.lastCommit) {
    const timeSince = Date.now() - new Date(recentActivity.lastCommit).getTime();
    if (timeSince > 3600000) { // 1 hour
      actions.push({
        id: 'commit-reminder',
        label: 'Time to commit?',
        icon: 'clock',
        action: 'git.openCommit',
        priority: 'medium'
      });
    }
  }
  
  return actions;
}

/**
 * Track achievement progress
 */
export function trackAchievement(event, data) {
  // Achievement definitions
  const achievements = {
    'first-commit': { 
      name: 'First Steps', 
      description: 'Made your first commit',
      icon: '🎯',
      condition: (stats) => stats.totalCommits >= 1
    },
    'commit-streak-7': {
      name: 'Consistent Coder',
      description: '7 days commit streak',
      icon: '🔥',
      condition: (stats) => stats.commitStreak >= 7
    },
    'clean-code': {
      name: 'Clean Code Master',
      description: '10 commits with no code issues',
      icon: '✨',
      condition: (stats) => stats.cleanCommits >= 10
    },
    'early-bird': {
      name: 'Early Bird',
      description: 'Committed before 8 AM',
      icon: '🌅',
      condition: (stats) => stats.earlyCommits >= 1
    },
    'night-owl': {
      name: 'Night Owl',
      description: 'Committed after 10 PM',
      icon: '🦉',
      condition: (stats) => stats.nightCommits >= 1
    },
    'refactor-king': {
      name: 'Refactor King',
      description: 'Improved code complexity 5 times',
      icon: '👑',
      condition: (stats) => stats.refactorCount >= 5
    }
  };
  
  return { achievements, unlocked: [] };
}

/**
 * Analyze session productivity
 */
export async function analyzeSession(sessionData) {
  const analysis = {
    duration: 0,
    filesModified: sessionData.files?.length || 0,
    linesAdded: 0,
    linesRemoved: 0,
    commits: sessionData.commits?.length || 0,
    productivity: 'medium',
    focusScore: 0,
    insights: []
  };
  
  // Calculate duration
  if (sessionData.startTime && sessionData.endTime) {
    analysis.duration = (sessionData.endTime - sessionData.startTime) / 1000 / 60; // minutes
  }
  
  // Count line changes
  if (sessionData.diff) {
    const lines = sessionData.diff.split('\n');
    analysis.linesAdded = lines.filter(l => l.startsWith('+')).length;
    analysis.linesRemoved = lines.filter(l => l.startsWith('-')).length;
  }
  
  // Calculate productivity
  const velocity = (analysis.linesAdded + analysis.linesRemoved) / Math.max(analysis.duration, 1);
  if (velocity > 10) {
    analysis.productivity = 'high';
    analysis.insights.push('High coding velocity! You\'re on fire! 🔥');
  } else if (velocity < 3) {
    analysis.productivity = 'low';
    analysis.insights.push('Take your time, quality over quantity! 🎯');
  }
  
  // Focus score (less context switching = higher focus)
  if (sessionData.fileChanges) {
    const uniqueFiles = new Set(sessionData.fileChanges.map(c => c.file)).size;
    analysis.focusScore = Math.max(0, 100 - (uniqueFiles * 5));
    
    if (analysis.focusScore > 80) {
      analysis.insights.push('Great focus on specific files! 🎯');
    } else if (analysis.focusScore < 40) {
      analysis.insights.push('Lots of context switching. Consider focusing on fewer files at once. 🔄');
    }
  }
  
  // Commit frequency insight
  if (analysis.duration > 60 && analysis.commits === 0) {
    analysis.insights.push('You\'ve been coding for a while. Consider committing your work! 💾');
  } else if (analysis.commits > analysis.duration / 10) {
    analysis.insights.push('Frequent commits! Great version control hygiene! ✅');
  }
  
  return analysis;
}

/**
 * Rule-based commit message generator (fallback)
 */
function generateRuleBasedCommitMessage(files, diff) {
  const fileCount = files.length;
  const additions = (diff.match(/^\+[^+]/gm) || []).length;
  const deletions = (diff.match(/^-[^-]/gm) || []).length;
  
  // Determine type
  let type = 'chore';
  let action = 'Update';
  
  // Check for feature indicators
  if (diff.match(/\b(new|add|create|implement|feature)\b/i)) {
    type = 'feat';
    action = 'Add';
  }
  // Check for bug fix indicators
  else if (diff.match(/\b(fix|bug|issue|error|problem)\b/i)) {
    type = 'fix';
    action = 'Fix';
  }
  // Check for refactoring
  else if (deletions > additions * 1.5 || diff.match(/\b(refactor|cleanup|improve)\b/i)) {
    type = 'refactor';
    action = 'Refactor';
  }
  // Check for documentation
  else if (files.some(f => f.match(/\.(md|txt)$/i)) || diff.match(/\b(docs?|documentation|readme)\b/i)) {
    type = 'docs';
    action = 'Update';
  }
  // Check for styling
  else if (files.some(f => f.match(/\.(css|scss|less)$/i)) || diff.match(/\b(style|css|styling)\b/i)) {
    type = 'style';
    action = 'Update';
  }
  
  // Determine scope
  let scope = '';
  if (fileCount === 1) {
    const fileName = files[0].split('/').pop();
    const componentName = fileName.replace(/\.(jsx?|tsx?|css|scss|vue|py|java|go)$/, '');
    scope = componentName;
  } else {
    // Find common directory
    const dirs = files.map(f => f.split('/').slice(0, -1).join('/'));
    const commonDir = dirs[0];
    if (dirs.every(d => d.startsWith(commonDir))) {
      scope = commonDir.split('/').pop() || 'multiple';
    } else {
      scope = 'multiple';
    }
  }
  
  // Build message
  const scopePart = scope ? `(${scope})` : '';
  
  if (fileCount === 1) {
    return `${type}${scopePart}: ${action} ${scope}`;
  } else {
    return `${type}${scopePart}: ${action} ${fileCount} files`;
  }
}

/**
 * Rule-based code review (fallback)
 */
function generateRuleBasedReview(files, diff) {
  const issues = [];
  const suggestions = [];
  let score = 8;
  
  // Check for common issues
  if (diff.match(/console\.log/g)) {
    issues.push({ severity: 'warning', message: 'Console.log statements found (consider removing)' });
    score -= 0.5;
  }
  
  if (diff.match(/debugger/g)) {
    issues.push({ severity: 'warning', message: 'Debugger statements found' });
    score -= 1;
  }
  
  if (diff.match(/TODO|FIXME|HACK/g)) {
    issues.push({ severity: 'info', message: 'TODO/FIXME comments present' });
  }
  
  const longLines = (diff.match(/^\+.{120,}/gm) || []).length;
  if (longLines > 5) {
    issues.push({ severity: 'info', message: `${longLines} long lines (>120 chars) detected` });
    suggestions.push('Consider breaking long lines for better readability');
    score -= 0.5;
  }
  
  // Check for potential errors
  if (diff.match(/==\s*null|==\s*undefined/g)) {
    issues.push({ severity: 'warning', message: 'Loose equality with null/undefined (use === instead)' });
    score -= 1;
  }
  
  if (diff.match(/var\s+\w+/g)) {
    suggestions.push('Consider using let/const instead of var');
    score -= 0.5;
  }
  
  // Positive feedback
  if (diff.match(/test|spec|describe|it\(/g)) {
    suggestions.push('Great job including tests! ✅');
    score += 0.5;
  }
  
  if (diff.match(/\/\*\*[\s\S]*?\*\//g)) {
    suggestions.push('Good documentation with JSDoc comments! 📝');
    score += 0.5;
  }
  
  return {
    score: Math.max(1, Math.min(10, Math.round(score))),
    issues,
    suggestions,
    summary: `Code review complete. ${issues.length} issue(s) found. ${suggestions.length} suggestion(s).`
  };
}

export default {
  generateSmartCommitMessage,
  reviewCodeChanges,
  analyzeCodeComplexity,
  predictNextFiles,
  suggestQuickActions,
  trackAchievement,
  analyzeSession,
  initializeAI
};
