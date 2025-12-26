/**
 * Touch Gestures Utility for Mobile Development
 * Provides swipe, pinch-to-zoom, and long-press gestures
 */

export class TouchGestureHandler {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      swipeThreshold: options.swipeThreshold || 50,
      swipeTimeout: options.swipeTimeout || 300,
      longPressDelay: options.longPressDelay || 500,
      pinchThreshold: options.pinchThreshold || 0.1,
      ...options
    };

    this.touchStart = { x: 0, y: 0, time: 0 };
    this.touchEnd = { x: 0, y: 0, time: 0 };
    this.longPressTimer = null;
    this.initialPinchDistance = 0;
    this.callbacks = {};

    this.init();
  }

  init() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Handle multi-touch for pinch
    if (e.touches.length === 2) {
      this.initialPinchDistance = this.getPinchDistance(e.touches);
      this.clearLongPress();
    } else {
      // Start long press timer
      this.longPressTimer = setTimeout(() => {
        this.trigger('longpress', {
          x: this.touchStart.x,
          y: this.touchStart.y
        });
      }, this.options.longPressDelay);
    }
  }

  handleTouchMove(e) {
    // Clear long press on move
    this.clearLongPress();

    // Handle pinch gesture
    if (e.touches.length === 2) {
      const currentDistance = this.getPinchDistance(e.touches);
      const scale = currentDistance / this.initialPinchDistance;
      
      if (Math.abs(scale - 1) > this.options.pinchThreshold) {
        this.trigger('pinch', {
          scale,
          center: this.getPinchCenter(e.touches)
        });
      }
    }
  }

  handleTouchEnd(e) {
    this.clearLongPress();

    if (e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    this.touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Calculate swipe
    const deltaX = this.touchEnd.x - this.touchStart.x;
    const deltaY = this.touchEnd.y - this.touchStart.y;
    const deltaTime = this.touchEnd.time - this.touchStart.time;

    // Check if it's a swipe
    if (deltaTime < this.options.swipeTimeout) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > this.options.swipeThreshold || absY > this.options.swipeThreshold) {
        // Determine direction
        if (absX > absY) {
          // Horizontal swipe
          const direction = deltaX > 0 ? 'right' : 'left';
          this.trigger('swipe', {
            direction,
            distance: absX,
            velocity: absX / deltaTime
          });
        } else {
          // Vertical swipe
          const direction = deltaY > 0 ? 'down' : 'up';
          this.trigger('swipe', {
            direction,
            distance: absY,
            velocity: absY / deltaTime
          });
        }
      }
    }
  }

  getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getPinchCenter(touches) {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }

  clearLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event, callback) {
    if (!this.callbacks[event]) return;
    this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
  }

  trigger(event, data) {
    if (!this.callbacks[event]) return;
    this.callbacks[event].forEach(callback => callback(data));
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.clearLongPress();
  }
}

/**
 * Hook for React components
 */
export function useTouchGestures(ref, handlers = {}) {
  React.useEffect(() => {
    if (!ref.current) return;

    const gestureHandler = new TouchGestureHandler(ref.current);

    if (handlers.onSwipe) gestureHandler.on('swipe', handlers.onSwipe);
    if (handlers.onPinch) gestureHandler.on('pinch', handlers.onPinch);
    if (handlers.onLongPress) gestureHandler.on('longpress', handlers.onLongPress);

    return () => gestureHandler.destroy();
  }, [ref, handlers]);
}

/**
 * Utility functions for mobile-specific features
 */
export const mobileUtils = {
  // Check if device is mobile
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Check if device is iOS
  isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },

  // Check if device is Android
  isAndroid() {
    return /Android/i.test(navigator.userAgent);
  },

  // Get safe area insets for notched devices
  getSafeAreaInsets() {
    return {
      top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0'),
      right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sar') || '0'),
      bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0'),
      left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sal') || '0')
    };
  },

  // Check if app is installed as PWA
  isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  },

  // Vibrate device (if supported)
  vibrate(pattern = 50) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  // Request fullscreen (for immersive experience)
  requestFullscreen(element = document.documentElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  },

  // Exit fullscreen
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },

  // Share content (Web Share API)
  async share(data) {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        console.error('Error sharing:', err);
        return false;
      }
    }
    return false;
  },

  // Copy to clipboard
  async copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy:', err);
        return false;
      }
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  },

  // Prevent pull-to-refresh on mobile
  preventPullToRefresh() {
    let lastTouchY = 0;
    let preventPullToRefresh = false;

    document.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      lastTouchY = e.touches[0].clientY;
      preventPullToRefresh = window.pageYOffset === 0;
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const touchYDelta = touchY - lastTouchY;
      lastTouchY = touchY;

      if (preventPullToRefresh && touchYDelta > 0) {
        e.preventDefault();
      }
    }, { passive: false });
  },

  // Enable smooth scrolling
  enableSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
  },

  // Get device orientation
  getOrientation() {
    return window.screen.orientation?.type || 
           (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  },

  // Lock orientation (PWA only)
  async lockOrientation(orientation = 'portrait') {
    if (window.screen.orientation && window.screen.orientation.lock) {
      try {
        await window.screen.orientation.lock(orientation);
        return true;
      } catch (err) {
        console.error('Orientation lock failed:', err);
        return false;
      }
    }
    return false;
  }
};
