# 📱 Android APK Conversion Guide

## Converting Gemini CLI UI to Native Android APK

This guide explains how to convert the Gemini CLI UI web application into a native Android APK using various tools and approaches.

---

## 🎯 Overview

Gemini CLI UI is a Progressive Web App (PWA) that can be converted to a native Android application using several methods:

1. **Trusted Web Activity (TWA)** - Google's recommended approach
2. **Capacitor** - Modern cross-platform framework
3. **Apache Cordova** - Traditional hybrid app framework
4. **WebView Wrapper** - Simple custom Android app

---

## ✅ Method 1: Trusted Web Activity (TWA) - RECOMMENDED

TWA allows you to package your PWA as a native Android app that opens in Chrome Custom Tabs.

### Prerequisites
- Android Studio installed
- Node.js and npm
- Your PWA deployed to HTTPS domain

### Steps

#### 1. Install Bubblewrap CLI
```bash
npm install -g @bubblewrap/cli
```

#### 2. Initialize TWA Project
```bash
bubblewrap init --manifest https://yourdomain.com/manifest.json
```

This will prompt you for:
- App name
- Package name (e.g., `com.yourcompany.geminicli`)
- Host URL
- Icon paths
- Theme color
- Orientation

#### 3. Build the APK
```bash
bubblewrap build
```

#### 4. Sign the APK (for production)
```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore release-key.keystore -alias gemini-cli -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key.keystore app-release-unsigned.apk gemini-cli

# Optimize APK
zipalign -v 4 app-release-unsigned.apk gemini-cli.apk
```

### Advantages
✅ Full PWA features
✅ No WebView wrapper overhead
✅ Uses Chrome's latest engine
✅ Automatic updates via web
✅ Smallest app size

### Disadvantages
❌ Requires HTTPS deployment
❌ Chrome must be installed on device
❌ Limited native API access

---

## ✅ Method 2: Capacitor (Modern & Recommended for Advanced Features)

Capacitor provides a modern bridge between web apps and native mobile platforms.

### Prerequisites
- Node.js and npm
- Android Studio
- JDK 11 or higher

### Steps

#### 1. Install Capacitor
```bash
cd /path/to/gemini-cli-ui
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

#### 2. Initialize Capacitor
```bash
npx cap init "Gemini CLI UI" "com.yourcompany.geminicli"
```

Edit `capacitor.config.json`:
```json
{
  "appId": "com.yourcompany.geminicli",
  "appName": "Gemini CLI UI",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#1e1e1e"
    }
  }
}
```

#### 3. Build Web Assets
```bash
npm run build
```

#### 4. Add Android Platform
```bash
npx cap add android
```

#### 5. Sync Assets
```bash
npx cap sync android
```

#### 6. Open in Android Studio
```bash
npx cap open android
```

#### 7. Configure Android App

**Update `android/app/src/main/AndroidManifest.xml`:**
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Add permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        <!-- Activities here -->
    </application>
</manifest>
```

**Update `android/app/build.gradle`:**
```gradle
android {
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.yourcompany.geminicli"
        minSdkVersion 22
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
}
```

#### 8. Build APK
In Android Studio:
- Build → Build Bundle(s) / APK(s) → Build APK(s)

Or via command line:
```bash
cd android
./gradlew assembleDebug  # Debug APK
./gradlew assembleRelease  # Release APK
```

APK location: `android/app/build/outputs/apk/`

### Adding Native Features

#### Terminal Access (Advanced)
For native terminal support, create a Capacitor plugin:

```typescript
// src/plugins/terminal.ts
import { registerPlugin } from '@capacitor/core';

export interface TerminalPlugin {
  executeCommand(options: { command: string }): Promise<{ output: string }>;
}

const Terminal = registerPlugin<TerminalPlugin>('Terminal');
export default Terminal;
```

Create Android plugin:
```java
// android/app/src/main/java/com/yourcompany/TerminalPlugin.java
package com.yourcompany.geminicli;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Terminal")
public class TerminalPlugin extends Plugin {
    @PluginMethod
    public void executeCommand(PluginCall call) {
        String command = call.getString("command");
        // Execute command using ProcessBuilder
        // Return output
        call.resolve();
    }
}
```

### Advantages
✅ Full native API access
✅ Works offline completely
✅ Better performance than Cordova
✅ Modern tooling
✅ Active community

### Disadvantages
❌ Larger app size
❌ More complex setup
❌ Requires rebuilding for updates

---

## ✅ Method 3: Apache Cordova (Traditional)

### Prerequisites
- Node.js and npm
- Android Studio
- Cordova CLI

### Steps

#### 1. Install Cordova
```bash
npm install -g cordova
```

#### 2. Create Cordova Project
```bash
cordova create gemini-cli-android com.yourcompany.geminicli "Gemini CLI UI"
cd gemini-cli-android
```

#### 3. Add Android Platform
```bash
cordova platform add android
```

#### 4. Copy Web Assets
```bash
# Build your web app first
cd /path/to/gemini-cli-ui
npm run build

# Copy to Cordova www folder
cp -r dist/* /path/to/gemini-cli-android/www/
```

#### 5. Configure App

Edit `config.xml`:
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.yourcompany.geminicli" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
    <name>Gemini CLI UI</name>
    <description>Mobile IDE for Gemini CLI</description>
    <author email="your@email.com">Your Name</author>
    
    <content src="index.html" />
    <access origin="*" />
    
    <preference name="Orientation" value="default" />
    <preference name="Fullscreen" value="false" />
    
    <platform name="android">
        <preference name="android-minSdkVersion" value="22" />
        <preference name="android-targetSdkVersion" value="33" />
    </platform>
</widget>
```

#### 6. Build APK
```bash
cordova build android --release
```

### Advantages
✅ Mature ecosystem
✅ Many plugins available
✅ Good documentation

### Disadvantages
❌ Older architecture
❌ Slower than modern alternatives
❌ Less active development

---

## ✅ Method 4: Custom WebView Wrapper (Simplest)

Create a minimal Android app that wraps your web app in a WebView.

### Steps

#### 1. Create Android Project in Android Studio
- New Project → Empty Activity
- Package name: `com.yourcompany.geminicli`
- Minimum SDK: 22 (Android 5.1)

#### 2. Update MainActivity

**MainActivity.java:**
```java
package com.yourcompany.geminicli;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        
        // Enable DOM storage
        webSettings.setDomStorageEnabled(true);
        
        // Enable WebSQL
        webSettings.setDatabaseEnabled(true);
        
        // Enable local storage
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        
        // Set WebView client
        webView.setWebViewClient(new WebViewClient());
        
        // Load your web app
        webView.loadUrl("https://yourdomain.com");
        // Or load local assets:
        // webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

**activity_main.xml:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</RelativeLayout>
```

#### 3. Update AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<application
    android:usesCleartextTraffic="true"
    ...>
    <activity android:name=".MainActivity"
        android:configChanges="orientation|screenSize">
        <!-- Activity config -->
    </activity>
</application>
```

#### 4. Build APK
Build → Build Bundle(s) / APK(s) → Build APK(s)

### Advantages
✅ Simplest approach
✅ Full control over WebView
✅ Smallest codebase

### Disadvantages
❌ No native features
❌ Manual WebView management
❌ Security considerations

---

## 🔧 Common Configuration

### App Icons

Generate icons for all densities:
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

Use online tools like:
- https://romannurik.github.io/AndroidAssetStudio/
- https://icon.kitchen/

### Splash Screen

Create splash screen drawable:
```xml
<!-- android/app/src/main/res/drawable/splash.xml -->
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo"/>
    </item>
</layer-list>
```

### ProGuard Rules (for release builds)

Add to `android/app/proguard-rules.pro`:
```
-keep class com.yourcompany.geminicli.** { *; }
-keepattributes *Annotation*
-dontwarn okhttp3.**
-dontwarn okio.**
```

---

## 📦 Distribution

### Google Play Store

1. **Create Developer Account**
   - https://play.google.com/console
   - $25 one-time fee

2. **Prepare Store Listing**
   - App name, description
   - Screenshots (2-8 required)
   - Feature graphic (1024x500)
   - Icon (512x512)
   - Privacy policy URL

3. **Upload APK/AAB**
   - Recommended: Android App Bundle (.aab)
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   - APK location: `app/build/outputs/bundle/release/`

4. **Complete Content Rating**

5. **Set Pricing & Distribution**

6. **Submit for Review**

### Alternative: Direct APK Distribution

- Host APK on your website
- Users enable "Install from Unknown Sources"
- Download and install APK
- Consider using Firebase App Distribution for beta testing

---

## 🔐 Security Considerations

### 1. HTTPS Only
Always use HTTPS for production:
```xml
<application
    android:usesCleartextTraffic="false"
    ...>
```

### 2. Certificate Pinning
For production apps, implement certificate pinning:
```java
// Add OkHttp dependency for certificate pinning
```

### 3. ProGuard/R8
Enable code obfuscation in release builds:
```gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 4. Secure Storage
Use Android Keystore for sensitive data:
```java
// Store auth tokens securely
```

---

## 🧪 Testing

### Local Testing
```bash
# Install debug APK on connected device
adb install app-debug.apk

# View logs
adb logcat
```

### Emulator Testing
1. Open Android Studio
2. Tools → AVD Manager
3. Create Virtual Device
4. Run app on emulator

### Physical Device Testing
1. Enable Developer Options on device
2. Enable USB Debugging
3. Connect via USB
4. Install APK via Android Studio or adb

---

## 🚀 Performance Optimization

### 1. Enable WebView Acceleration
```java
webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
```

### 2. Optimize Assets
```bash
# Minify JavaScript and CSS
npm run build

# Compress images
# Use WebP format for better compression
```

### 3. Enable Hardware Acceleration
```xml
<application
    android:hardwareAccelerated="true"
    ...>
```

### 4. Lazy Loading
Implement lazy loading for terminal and heavy components

---

## 📱 Future: Termux Integration

For advanced users who want to integrate with Termux:

### Option 1: Termux:API Integration
```bash
# Install Termux:API
pkg install termux-api

# Access from your app via intents
```

### Option 2: Termux Plugin
Create a Capacitor plugin that bridges to Termux APIs

### Option 3: Shared Terminal Backend
Run a local server in Termux and connect your APK to it

**Note**: This requires advanced Android development and user setup.

---

## 📚 Resources

### Documentation
- [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Capacitor](https://capacitorjs.com/docs)
- [Cordova](https://cordova.apache.org/docs/en/latest/)
- [Android WebView](https://developer.android.com/guide/webapps/webview)

### Tools
- [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
- [PWA Builder](https://www.pwabuilder.com/)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)

### Communities
- [r/androiddev](https://reddit.com/r/androiddev)
- [Stack Overflow Android](https://stackoverflow.com/questions/tagged/android)

---

## 🆘 Troubleshooting

### Issue: WebView not loading
**Solution**: Check AndroidManifest.xml has INTERNET permission

### Issue: JavaScript not working
**Solution**: Enable JavaScript in WebSettings

### Issue: CORS errors
**Solution**: Configure server to allow WebView user agent, or use local assets

### Issue: App crashes on startup
**Solution**: Check logcat for errors, verify all permissions

### Issue: Terminal not responsive on mobile
**Solution**: Ensure touch event handlers are properly configured

---

## ✅ Checklist

Before releasing your APK:

- [ ] Test on multiple Android versions (5.0+)
- [ ] Test on different screen sizes
- [ ] Test offline functionality
- [ ] Verify all permissions are justified
- [ ] Add error handling for network issues
- [ ] Implement analytics (optional)
- [ ] Create privacy policy
- [ ] Test APK signing
- [ ] Verify icon and splash screen
- [ ] Test deep linking (if applicable)
- [ ] Performance testing
- [ ] Security audit

---

## 🎉 Conclusion

You now have multiple options to convert Gemini CLI UI to a native Android APK:

- **Quick & Simple**: TWA (Bubblewrap)
- **Best Features**: Capacitor
- **Traditional**: Cordova
- **Full Control**: Custom WebView

Choose the method that best fits your needs and technical requirements!

---

**Happy Android Development! 🚀📱**
