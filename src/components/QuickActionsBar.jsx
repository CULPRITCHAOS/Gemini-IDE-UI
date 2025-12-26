import React, { useState, useEffect } from 'react';
import { Zap, GitCommit, Search, BarChart3, TestTube, Clock, Sparkles, ChevronRight } from 'lucide-react';

function QuickActionsBar({ currentFile, gitStatus, onAction }) {
  const [actions, setActions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    generateActions();
  }, [currentFile, gitStatus]);

  const generateActions = () => {
    const newActions = [];
    
    // Git-related actions
    if (gitStatus && currentFile && gitStatus.modified && gitStatus.modified.includes(currentFile)) {
      newActions.push({
        id: 'commit-current',
        label: 'Commit this file',
        icon: GitCommit,
        color: 'bg-blue-500 hover:bg-blue-600',
        action: () => onAction('commit', currentFile),
        priority: 'high'
      });
      
      newActions.push({
        id: 'review-changes',
        label: 'Review changes',
        icon: Search,
        color: 'bg-purple-500 hover:bg-purple-600',
        action: () => onAction('review', currentFile),
        priority: 'high'
      });
    }
    
    // File-based actions
    if (currentFile) {
      const ext = currentFile.split('.').pop();
      if (['jsx', 'tsx', 'js', 'ts', 'py', 'java', 'go'].includes(ext)) {
        newActions.push({
          id: 'analyze-complexity',
          label: 'Analyze complexity',
          icon: BarChart3,
          color: 'bg-orange-500 hover:bg-orange-600',
          action: () => onAction('analyze', currentFile),
          priority: 'medium'
        });
        
        if (!currentFile.includes('.test.') && !currentFile.includes('.spec.')) {
          newActions.push({
            id: 'create-test',
            label: 'Create test file',
            icon: TestTube,
            color: 'bg-green-500 hover:bg-green-600',
            action: () => onAction('create-test', currentFile),
            priority: 'low'
          });
        }
      }
    }
    
    // AI suggestions
    if (currentFile) {
      newActions.push({
        id: 'ai-suggest',
        label: 'AI suggestions',
        icon: Sparkles,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        action: () => onAction('ai-suggest', currentFile),
        priority: 'medium'
      });
    }
    
    setActions(newActions);
  };

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300">
      {isExpanded ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 animate-slideUp">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Quick Actions
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 max-w-2xl">
            {actions
              .sort((a, b) => {
                const priority = { high: 3, medium: 2, low: 1 };
                return priority[b.priority] - priority[a.priority];
              })
              .slice(0, 5)
              .map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`${action.color} text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all transform hover:scale-105 shadow-md`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Context-aware suggestions based on your current work
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 animate-pulse"
          title="Quick Actions"
        >
          <Zap className="w-5 h-5" />
        </button>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default QuickActionsBar;
