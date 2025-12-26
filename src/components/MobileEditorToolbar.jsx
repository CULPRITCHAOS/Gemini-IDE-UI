import React, { useState } from 'react';
import { 
  Code, Copy, Download, Share2, Undo, Redo, Search, Replace, 
  ZoomIn, ZoomOut, Eye, EyeOff, Save, X, ChevronDown, ChevronUp,
  Smartphone, Monitor, Settings, Play
} from 'lucide-react';
import { mobileUtils } from '../utils/touchGestures';

function MobileEditorToolbar({ 
  onAction, 
  canUndo = true, 
  canRedo = true,
  currentFile,
  hasChanges = false
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleAction = async (action) => {
    // Haptic feedback
    mobileUtils.vibrate(10);
    
    if (onAction) {
      onAction(action);
    }
  };

  const primaryActions = [
    {
      icon: Save,
      label: 'Save',
      action: 'save',
      disabled: !hasChanges,
      color: hasChanges ? 'text-green-600' : 'text-gray-400'
    },
    {
      icon: Copy,
      label: 'Copy',
      action: 'copy',
      disabled: false
    },
    {
      icon: Search,
      label: 'Find',
      action: 'find',
      disabled: false
    },
    {
      icon: showPreview ? EyeOff : Eye,
      label: showPreview ? 'Code' : 'Preview',
      action: 'toggle-preview',
      disabled: false,
      color: showPreview ? 'text-blue-600' : ''
    }
  ];

  const secondaryActions = [
    {
      icon: Undo,
      label: 'Undo',
      action: 'undo',
      disabled: !canUndo
    },
    {
      icon: Redo,
      label: 'Redo',
      action: 'redo',
      disabled: !canRedo
    },
    {
      icon: Replace,
      label: 'Replace',
      action: 'replace',
      disabled: false
    },
    {
      icon: ZoomIn,
      label: 'Zoom In',
      action: 'zoom-in',
      disabled: false
    },
    {
      icon: ZoomOut,
      label: 'Zoom Out',
      action: 'zoom-out',
      disabled: false
    },
    {
      icon: Download,
      label: 'Download',
      action: 'download',
      disabled: false
    },
    {
      icon: Share2,
      label: 'Share',
      action: 'share',
      disabled: false
    },
    {
      icon: Play,
      label: 'Run',
      action: 'run',
      disabled: false,
      color: 'text-green-600'
    }
  ];

  const renderAction = (action, index) => {
    const Icon = action.icon;
    return (
      <button
        key={index}
        onClick={() => {
          if (action.action === 'toggle-preview') {
            setShowPreview(!showPreview);
          }
          handleAction(action.action);
        }}
        disabled={action.disabled}
        className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[56px] transition-colors ${
          action.disabled 
            ? 'opacity-40 cursor-not-allowed' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95'
        } ${action.color || 'text-gray-700 dark:text-gray-300'}`}
        title={action.label}
      >
        <Icon className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-medium">{action.label}</span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Current File Info */}
      {currentFile && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Code className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentFile}
            </span>
            {hasChanges && (
              <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      )}

      {/* Primary Actions - Always Visible */}
      <div className="flex items-center justify-around px-2 py-2 bg-gray-50 dark:bg-gray-900">
        {primaryActions.map((action, index) => renderAction(action, index))}
      </div>

      {/* Secondary Actions - Expandable */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-32' : 'max-h-0'
      }`}>
        <div className="grid grid-cols-4 gap-1 px-2 py-2 border-t border-gray-200 dark:border-gray-700">
          {secondaryActions.map((action, index) => renderAction(action, index))}
        </div>
      </div>

      {/* Quick Snippets (Optional) */}
      {isExpanded && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Quick Insert:
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { label: '( )', value: '()' },
              { label: '{ }', value: '{}' },
              { label: '[ ]', value: '[]' },
              { label: '< >', value: '<>' },
              { label: '=>', value: '=>' },
              { label: '===', value: '===' },
              { label: '!==', value: '!==' },
              { label: '...', value: '...' }
            ].map((snippet, index) => (
              <button
                key={index}
                onClick={() => handleAction({ type: 'insert', value: snippet.value })}
                className="px-3 py-1 text-xs font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
              >
                {snippet.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileEditorToolbar;
