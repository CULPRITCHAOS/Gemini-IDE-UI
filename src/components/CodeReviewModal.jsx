import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle, Sparkles, RefreshCw, TrendingUp, Shield } from 'lucide-react';
import { authenticatedFetch } from '../utils/api';

function CodeReviewModal({ isOpen, onClose, selectedProject, selectedFiles }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [review, setReview] = useState(null);

  useEffect(() => {
    if (isOpen && selectedFiles && selectedFiles.length > 0) {
      performReview();
    }
  }, [isOpen, selectedFiles]);

  const performReview = async () => {
    setIsReviewing(true);
    try {
      const response = await authenticatedFetch('/api/git/review-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: selectedProject.name,
          files: Array.from(selectedFiles)
        })
      });
      
      const data = await response.json();
      if (data.review) {
        setReview(data.review);
      }
    } catch (error) {
      console.error('Review failed:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 6) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Code Review</h2>
              <p className="text-sm text-white/80">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {isReviewing ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Analyzing your code...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This may take a few moments
              </p>
            </div>
          ) : review ? (
            <div className="p-6 space-y-6">
              {/* Score Card */}
              <div className={`${getScoreBg(review.score)} rounded-lg p-6 border-2 ${review.score >= 8 ? 'border-green-300 dark:border-green-700' : review.score >= 6 ? 'border-yellow-300 dark:border-yellow-700' : 'border-red-300 dark:border-red-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Code Quality Score
                    </h3>
                    <div className="flex items-end gap-2">
                      <span className={`text-5xl font-bold ${getScoreColor(review.score)}`}>
                        {review.score}
                      </span>
                      <span className="text-2xl text-gray-400 dark:text-gray-500 pb-1">/10</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {review.score >= 8 && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-medium">Excellent</span>
                      </div>
                    )}
                    {review.score >= 6 && review.score < 8 && (
                      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <TrendingUp className="w-8 h-8" />
                        <span className="font-medium">Good</span>
                      </div>
                    )}
                    {review.score < 6 && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-8 h-8" />
                        <span className="font-medium">Needs Work</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              {review.summary && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Summary
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {review.summary}
                  </p>
                </div>
              )}

              {/* Issues */}
              {review.issues && review.issues.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Issues Found ({review.issues.length})
                  </h3>
                  <div className="space-y-2">
                    {review.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {issue.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {review.suggestions && review.suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Suggestions ({review.suggestions.length})
                  </h3>
                  <div className="space-y-2">
                    {review.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <Info className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No issues - celebration */}
              {(!review.issues || review.issues.length === 0) && review.score >= 8 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Excellent Work! 🎉
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your code looks great. No critical issues found.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Shield className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No review data available
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={performReview}
            disabled={isReviewing}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isReviewing ? 'animate-spin' : ''}`} />
            Re-analyze
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default CodeReviewModal;
