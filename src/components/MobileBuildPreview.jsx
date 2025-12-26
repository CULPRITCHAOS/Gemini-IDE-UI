import React, { useState, useEffect } from 'react';
import { 
  Play, Square, RefreshCw, Smartphone, Monitor, Tablet,
  ExternalLink, Download, Share2, AlertCircle, CheckCircle,
  Loader, Terminal, Eye, Code, Globe
} from 'lucide-react';
import { mobileUtils } from '../utils/touchGestures';
import { authenticatedFetch } from '../utils/api';

function MobileBuildPreview({ selectedProject }) {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildOutput, setBuildOutput] = useState('');
  const [buildStatus, setBuildStatus] = useState(null); // 'success', 'error', null
  const [previewUrl, setPreviewUrl] = useState(null);
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile', 'tablet', 'desktop'
  const [showOutput, setShowOutput] = useState(false);

  const deviceModes = [
    { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
    { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
    { id: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' }
  ];

  const handleBuild = async () => {
    if (!selectedProject) return;

    setIsBuilding(true);
    setBuildOutput('Starting build...\n');
    setBuildStatus(null);
    mobileUtils.vibrate(10);

    try {
      // Simulate build process (replace with actual build API)
      const response = await authenticatedFetch('/api/build/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: selectedProject.name,
          target: 'web'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setBuildOutput(prev => prev + '\n✓ Build completed successfully!\n' + (data.output || ''));
        setBuildStatus('success');
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
        }
        mobileUtils.vibrate([10, 50, 10]);
      } else {
        setBuildOutput(prev => prev + '\n✗ Build failed:\n' + (data.error || 'Unknown error'));
        setBuildStatus('error');
        mobileUtils.vibrate([50, 50, 50]);
      }
    } catch (error) {
      setBuildOutput(prev => prev + '\n✗ Build error: ' + error.message);
      setBuildStatus('error');
      mobileUtils.vibrate([50, 50, 50]);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDevServer = async () => {
    if (!selectedProject) return;

    setIsBuilding(true);
    setBuildOutput('Starting development server...\n');
    mobileUtils.vibrate(10);

    try {
      const response = await authenticatedFetch('/api/dev/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: selectedProject.name
        })
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        setBuildOutput(prev => prev + `\n✓ Dev server running at: ${data.url}\n`);
        setPreviewUrl(data.url);
        setBuildStatus('success');
      } else {
        setBuildOutput(prev => prev + '\n✗ Failed to start dev server\n' + (data.error || ''));
        setBuildStatus('error');
      }
    } catch (error) {
      setBuildOutput(prev => prev + '\n✗ Error: ' + error.message);
      setBuildStatus('error');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleShare = async () => {
    if (!previewUrl) return;

    const shared = await mobileUtils.share({
      title: `${selectedProject?.name || 'Project'} Preview`,
      text: 'Check out this project preview!',
      url: previewUrl
    });

    if (shared) {
      mobileUtils.vibrate(10);
    }
  };

  const renderDeviceFrame = () => {
    const mode = deviceModes.find(d => d.id === deviceMode);
    
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-8 border-gray-800 dark:border-gray-700 overflow-hidden transition-all duration-300"
          style={{ 
            width: mode.width,
            maxWidth: '100%',
            height: deviceMode === 'desktop' ? '600px' : '667px'
          }}
        >
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full"
              title="Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Globe className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-sm">No preview available</p>
              <p className="text-xs mt-2">Build or start dev server to see preview</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Build & Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className={`p-2 rounded-lg transition-colors ${
              showOutput 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle output"
          >
            <Terminal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Build Output (Collapsible) */}
      {showOutput && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="p-4 max-h-48 overflow-y-auto">
            <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {buildOutput || 'No build output yet'}
            </pre>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          onClick={handleBuild}
          disabled={isBuilding || !selectedProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {isBuilding ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">Build</span>
        </button>

        <button
          onClick={handleDevServer}
          disabled={isBuilding || !selectedProject}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">Dev Server</span>
        </button>

        {previewUrl && (
          <>
            <button
              onClick={() => window.open(previewUrl, '_blank')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setPreviewUrl(previewUrl + '?_=' + Date.now())}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Refresh preview"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Build Status Indicator */}
        {buildStatus && (
          <div className="ml-auto flex items-center gap-2">
            {buildStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Success
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Failed
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Device Mode Selector */}
      <div className="flex items-center justify-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {deviceModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => {
                setDeviceMode(mode.id);
                mobileUtils.vibrate(10);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                deviceMode === mode.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Preview Frame */}
      {renderDeviceFrame()}

      {/* Info Message */}
      {!selectedProject && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="text-center p-6">
            <Code className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Select a project to build and preview
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileBuildPreview;
