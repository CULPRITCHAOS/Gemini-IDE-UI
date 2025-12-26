import React, { useState } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Check,
  MessageSquare, Folder, Terminal, GitBranch, 
  Code, Eye, Sparkles, Trophy, Smartphone
} from 'lucide-react';

function MobileOnboarding({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Smartphone,
      title: 'Welcome to Gemini IDE',
      description: 'Your complete AI-powered development environment on mobile',
      features: [
        'Code anywhere, anytime',
        'Full IDE features on your phone',
        'Works offline with PWA',
        'Sync across all devices'
      ],
      image: '📱',
      color: 'from-purple-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Get coding help from Gemini AI instantly',
      features: [
        'Ask questions in natural language',
        'Get code suggestions',
        'Debug issues quickly',
        'Learn as you code'
      ],
      image: '💬',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Code,
      title: 'Mobile Code Editor',
      description: 'Full-featured code editor optimized for touch',
      features: [
        'Syntax highlighting',
        'Smart autocomplete',
        'Touch gestures (swipe, pinch)',
        'Quick snippet insertion'
      ],
      image: '⌨️',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: GitBranch,
      title: 'Git Integration',
      description: 'Manage version control from your phone',
      features: [
        'View changes and diffs',
        'AI-generated commit messages',
        'Create branches',
        'Push and pull'
      ],
      image: '🔀',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Eye,
      title: 'Build & Preview',
      description: 'See your changes instantly',
      features: [
        'One-tap builds',
        'Live preview',
        'Multiple device views',
        'Share with others'
      ],
      image: '👁️',
      color: 'from-pink-500 to-purple-600'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Features',
      description: 'Unique intelligent assistance',
      features: [
        'Smart commit messages',
        'Code review before commit',
        'Complexity analysis',
        'Achievement system'
      ],
      image: '✨',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('mobile_onboarding_completed', 'true');
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('mobile_onboarding_completed', 'true');
    if (onSkip) onSkip();
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        <button
          onClick={handleSkip}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Skip
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className={`h-full bg-gradient-to-r ${step.color} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Large Emoji/Icon */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-4 animate-bounce-slow">
            {step.image}
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            {step.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {step.description}
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          {step.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {feature}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        {currentStep === 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>💡 Pro Tip:</strong> Add this app to your home screen for the best experience! Tap Share → Add to Home Screen
            </p>
          </div>
        )}

        {currentStep === steps.length - 1 && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>🎉 You're all set!</strong> Start coding with AI assistance on your mobile device.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${step.color} text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all`}
          >
            <span>{currentStep < steps.length - 1 ? 'Next' : 'Get Started'}</span>
            {currentStep < steps.length - 1 ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <Check className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentStep
                  ? 'w-8 h-2 bg-gradient-to-r ' + step.color
                  : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MobileOnboarding;
