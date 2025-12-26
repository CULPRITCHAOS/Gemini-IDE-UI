import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, Flame, Target, Sparkles, X, Lock } from 'lucide-react';

function AchievementSystem({ onClose }) {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalCommits: 0,
    cleanCommits: 0,
    commitStreak: 0,
    earlyCommits: 0,
    nightCommits: 0,
    refactorCount: 0,
    linesWritten: 0
  });

  useEffect(() => {
    loadAchievements();
    loadStats();
  }, []);

  const loadStats = () => {
    // Load from localStorage
    const saved = localStorage.getItem('developerStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  };

  const loadAchievements = () => {
    const achievementsList = [
      {
        id: 'first-commit',
        name: 'First Steps',
        description: 'Made your first commit',
        icon: '🎯',
        unlocked: stats.totalCommits >= 1,
        progress: Math.min(stats.totalCommits, 1),
        target: 1,
        rarity: 'common'
      },
      {
        id: 'commit-10',
        name: 'Getting Started',
        description: 'Made 10 commits',
        icon: '📝',
        unlocked: stats.totalCommits >= 10,
        progress: Math.min(stats.totalCommits, 10),
        target: 10,
        rarity: 'common'
      },
      {
        id: 'commit-100',
        name: 'Century Club',
        description: 'Made 100 commits',
        icon: '💯',
        unlocked: stats.totalCommits >= 100,
        progress: Math.min(stats.totalCommits, 100),
        target: 100,
        rarity: 'rare'
      },
      {
        id: 'commit-streak-7',
        name: 'Consistent Coder',
        description: '7 days commit streak',
        icon: '🔥',
        unlocked: stats.commitStreak >= 7,
        progress: Math.min(stats.commitStreak, 7),
        target: 7,
        rarity: 'rare'
      },
      {
        id: 'clean-code',
        name: 'Clean Code Master',
        description: '10 commits with no code issues',
        icon: '✨',
        unlocked: stats.cleanCommits >= 10,
        progress: Math.min(stats.cleanCommits, 10),
        target: 10,
        rarity: 'epic'
      },
      {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Committed before 8 AM',
        icon: '🌅',
        unlocked: stats.earlyCommits >= 1,
        progress: Math.min(stats.earlyCommits, 1),
        target: 1,
        rarity: 'uncommon'
      },
      {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Committed after 10 PM',
        icon: '🦉',
        unlocked: stats.nightCommits >= 1,
        progress: Math.min(stats.nightCommits, 1),
        target: 1,
        rarity: 'uncommon'
      },
      {
        id: 'refactor-king',
        name: 'Refactor King',
        description: 'Improved code complexity 5 times',
        icon: '👑',
        unlocked: stats.refactorCount >= 5,
        progress: Math.min(stats.refactorCount, 5),
        target: 5,
        rarity: 'epic'
      },
      {
        id: 'prolific-writer',
        name: 'Prolific Writer',
        description: 'Wrote 10,000 lines of code',
        icon: '📚',
        unlocked: stats.linesWritten >= 10000,
        progress: Math.min(stats.linesWritten, 10000),
        target: 10000,
        rarity: 'legendary'
      }
    ];

    setAchievements(achievementsList);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
      case 'uncommon':
        return 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20';
      case 'rare':
        return 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'epic':
        return 'border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'legendary':
        return 'border-yellow-400 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20';
      default:
        return 'border-gray-400 dark:border-gray-600';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-yellow-500 to-orange-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Achievements</h2>
              <p className="text-sm text-white/80">
                {unlockedCount} of {totalCount} unlocked ({completionPercentage}%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`${getRarityColor(achievement.rarity)} rounded-lg p-4 border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'transform hover:scale-105 hover:shadow-lg' 
                    : 'opacity-60 grayscale'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  {achievement.unlocked ? (
                    <div className="p-1 bg-green-500 rounded-full">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {achievement.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {!achievement.unlocked && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.progress} / {achievement.target}
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {Math.round((achievement.progress / achievement.target) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Rarity Badge */}
                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className={`text-xs font-bold uppercase ${
                    achievement.rarity === 'legendary' ? 'text-yellow-600 dark:text-yellow-400' :
                    achievement.rarity === 'epic' ? 'text-purple-600 dark:text-purple-400' :
                    achievement.rarity === 'rare' ? 'text-blue-600 dark:text-blue-400' :
                    achievement.rarity === 'uncommon' ? 'text-green-600 dark:text-green-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.rarity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  Streak: {stats.commitStreak} days
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {stats.totalCommits} commits
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AchievementSystem;
