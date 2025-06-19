# Snap2Cash Mobile

A React Native mobile application for analyzing and estimating the resale value of items using AI-powered image analysis.

## Features

- **Camera Integration**: Take photos or select from gallery
- **AI Analysis**: Powered by Gemini AI for accurate item valuation
- **History Tracking**: Keep track of all your analyzed items
- **Favorites**: Save important analyses for quick access
- **Dark/Light Theme**: Automatic theme switching support
- **Cross-Platform**: Works on both iOS and Android

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Theme, Auth, Toast)
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── constants/          # App constants
├── assets/                 # Images, fonts, etc.
├── App.tsx                 # Main app component
└── app.json               # Expo configuration
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Expo Camera**: Camera functionality
- **Expo Image Picker**: Image selection from gallery
- **React Native Reanimated**: Smooth animations
- **Expo Linear Gradient**: Gradient backgrounds

## Configuration

### Camera Permissions

The app requires camera and photo library permissions. These are configured in `app.json`:

```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "This app needs access to camera to scan items for analysis.",
      "NSPhotoLibraryUsageDescription": "This app needs access to photo library to select images for analysis."
    }
  },
  "android": {
    "permissions": [
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE"
    ]
  }
}
```

### Environment Variables

Create a `.env` file in the mobile directory for environment-specific configuration:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

## Building for Production

### Android

1. Configure EAS Build:
   ```bash
   npm install -g @expo/cli
   eas build:configure
   ```

2. Build APK:
   ```bash
   eas build --platform android
   ```

### iOS

1. Build for iOS:
   ```bash
   eas build --platform ios
   ```

2. Submit to App Store:
   ```bash
   eas submit --platform ios
   ```

## API Integration

The mobile app is designed to work with the existing Snap2Cash backend. Update the API endpoints in the services to match your backend configuration.

### Backend Integration

To connect with your existing backend:

1. Update the API base URL in your environment variables
2. Modify the `geminiService.ts` to call your backend endpoints
3. Ensure CORS is properly configured on your backend for mobile requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

This project is part of the Snap2Cash application suite.