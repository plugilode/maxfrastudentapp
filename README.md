# MaxFra Academy - Mobile Microblading Training App

Professional microblading training application with AI-powered facial analysis for Android devices.

## Features

- **Facial Analysis**: Real-time camera access with precise eyebrow measurements
- **AI Recommendations**: Smart suggestions based on facial structure
- **Mobile Optimized**: Native Android app with Capacitor
- **Offline Support**: Core functionality works without internet
- **Professional UI**: Modern glass-morphic design in Spanish

## Development Setup

### Prerequisites
- Node.js 18+
- Android Studio
- Java Development Kit (JDK) 11+
- Android SDK

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the web app**
   ```bash
   npm run build
   ```

3. **Add Android platform**
   ```bash
   npx cap add android
   ```

4. **Sync with Android**
   ```bash
   npm run cap:sync
   ```

5. **Open in Android Studio**
   ```bash
   npm run cap:android
   ```

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run cap:sync` - Sync web assets to native
- `npm run cap:build` - Build and sync in one command
- `npm run cap:android` - Open Android Studio
- `npm run cap:serve` - Run on device with live reload

## Mobile Features

### Camera Integration
- Native camera access through Capacitor
- Optimized photo capture for facial analysis
- Permission handling for Android

### Performance Optimizations
- Lazy loading of components
- Image compression for analysis
- Efficient memory management
- Fast startup times

### Native Features
- Status bar customization
- Splash screen configuration
- Network status monitoring
- Device information access
- App state management

## Building for Production

### Debug Build
```bash
npm run cap:build
# Open Android Studio and build APK
```

### Release Build
1. Configure signing in Android Studio
2. Build signed APK/AAB
3. Upload to Google Play Console

### App Store Requirements
- Target API level 33+ (Android 13)
- 64-bit ARM support
- Privacy policy for camera usage
- App icons in multiple densities
- Feature graphics for store listing

## Camera Permissions

The app requires camera permissions for facial analysis:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
```

## Testing

### Device Testing
```bash
# Run on connected device with live reload
npm run cap:serve
```

### Emulator Testing
1. Open Android Studio
2. Create/start AVD
3. Run app from Android Studio

## Deployment

### Google Play Store Steps
1. Create developer account
2. Prepare store assets (icons, screenshots, descriptions)
3. Configure app signing
4. Upload AAB file
5. Complete store listing
6. Submit for review

### Required Assets
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (multiple sizes)
- Short description (80 chars)
- Full description (4000 chars)
- Privacy policy URL

## Architecture

```
src/
├── components/
│   ├── auth/          # Authentication screens
│   ├── camera/        # Camera and capture logic
│   ├── mobile/        # Mobile-specific components
│   ├── analysis/      # Facial analysis results
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Capacitor** - Native app wrapper
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Support

For technical support or questions:
- Email: support@maxfraacademy.com
- Documentation: [MaxFra Academy Docs](https://docs.maxfraacademy.com)

## License

Proprietary - MaxFra Academy Training System