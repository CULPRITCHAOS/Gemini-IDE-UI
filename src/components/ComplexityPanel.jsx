import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Code, FileCode, Brain, Gauge } from 'lucide-react';
import { authenticatedFetch } from '../utils/api';

function ComplexityPanel({ selectedProject, currentFile, fileContent }) {
  const [metrics, setMetrics] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (currentFile && fileContent) {
      analyzeComplexity();
    }
  }, [currentFile, fileContent]);

  const analyzeComplexity = async () => {
    if (!selectedProject || !currentFile) return;
    
    setIsAnalyzing(true);
    try {
      const response = await authenticatedFetch('/api/git/analyze-complexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: selectedProject.name,
          file: currentFile
        })
      });
      
      const data = await response.json();
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Complexity analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getComplexityLevel = (value, thresholds) => {
    if (value <= thresholds.low) return { level: 'Low', color: 'text-green-600 dark:text-green-400', icon: CheckCircle };
    if (value <= thresholds.medium) return { level: 'Medium', color: 'text-yellow-600 dark:text-yellow-400', icon: AlertTriangle };
    return { level: 'High', color: 'text-red-600 dark:text-red-400', icon: AlertTriangle };
  };

  if (!currentFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6">
        <Code className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-center">Select a file to analyze its complexity</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Code Analysis</h3>
        </div>
        <button
          onClick={analyzeComplexity}
          disabled={isAnalyzing}
          className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-purple-500 animate-pulse mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing code...</p>
            </div>
          </div>
        ) : metrics ? (
          <>
            {/* Maintainability Score */}
            <div className={`${getScoreBg(metrics.maintainabilityScore)} rounded-lg p-4 border-2 ${
              metrics.maintainabilityScore >= 80 ? 'border-green-300 dark:border-green-700' : 
              metrics.maintainabilityScore >= 60 ? 'border-yellow-300 dark:border-yellow-700' : 
              'border-red-300 dark:border-red-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maintainability Score
                </span>
                <Gauge className={`w-5 h-5 ${getScoreColor(metrics.maintainabilityScore)}`} />
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-4xl font-bold ${getScoreColor(metrics.maintainabilityScore)}`}>
                  {metrics.maintainabilityScore}
                </span>
                <span className="text-xl text-gray-400 pb-1">/100</span>
              </div>
              {metrics.maintainabilityScore >= 80 && (
                <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                  Excellent! This code is easy to maintain.
                </p>
              )}
              {metrics.maintainabilityScore >= 60 && metrics.maintainabilityScore < 80 && (
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                  Good, but could be improved.
                </p>
              )}
              {metrics.maintainabilityScore < 60 && (
                <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                  Consider refactoring for better maintainability.
                </p>
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Lines of Code */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Lines of Code
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.linesOfCode}
                </p>
                {metrics.linesOfCode > 300 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Consider splitting
                  </p>
                )}
              </div>

              {/* Cyclomatic Complexity */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Cyclomatic
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.cyclomaticComplexity}
                  </p>
                  {(() => {
                    const level = getComplexityLevel(metrics.cyclomaticComplexity, { low: 10, medium: 15 });
                    const Icon = level.icon;
                    return <Icon className={`w-4 h-4 ${level.color}`} />;
                  })()}
                </div>
                <p className={`text-xs mt-1 ${getComplexityLevel(metrics.cyclomaticComplexity, { low: 10, medium: 15 }).color}`}>
                  {getComplexityLevel(metrics.cyclomaticComplexity, { low: 10, medium: 15 }).level}
                </p>
              </div>

              {/* Cognitive Complexity */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Cognitive Complexity (Nesting)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metrics.cognitiveComplexity}
                    </p>
                    {(() => {
                      const level = getComplexityLevel(metrics.cognitiveComplexity, { low: 5, medium: 10 });
                      const Icon = level.icon;
                      return <Icon className={`w-4 h-4 ${level.color}`} />;
                    })()}
                  </div>
                  <span className={`text-xs font-medium ${getComplexityLevel(metrics.cognitiveComplexity, { low: 5, medium: 10 }).color}`}>
                    {getComplexityLevel(metrics.cognitiveComplexity, { low: 5, medium: 10 }).level}
                  </span>
                </div>
                {metrics.cognitiveComplexity > 10 && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    Deep nesting detected. Consider extracting functions.
                  </p>
                )}
              </div>
            </div>

            {/* Issues */}
            {metrics.issues && metrics.issues.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Issues Found ({metrics.issues.length})
                </h4>
                <div className="space-y-2">
                  {metrics.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                      <span className="text-red-800 dark:text-red-300">{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recommendations
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                {metrics.cyclomaticComplexity > 15 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Break down complex functions into smaller, focused ones</span>
                  </li>
                )}
                {metrics.cognitiveComplexity > 10 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Reduce nesting depth by using early returns or guard clauses</span>
                  </li>
                )}
                {metrics.linesOfCode > 300 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Split this file into smaller, more focused modules</span>
                  </li>
                )}
                {metrics.maintainabilityScore >= 80 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-green-700 dark:text-green-300">
                      Code quality is excellent! Keep up the good work! 🎉
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Info */}
            <div className="text-center py-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Analysis updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Code className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No metrics available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplexityPanel;
