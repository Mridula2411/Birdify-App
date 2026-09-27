# Birdify - Bird-Watching Education Game

A cross-platform bird-watching education game built with React Native and Expo that teaches users about birds from different continents through interactive quizzes and a collection system.

## Project Overview

Birdify is an educational mobile and web application that gamifies bird learning. Players select continents, navigate maps to find bird waypoints, complete quizzes about birds, and build their collection by earning feathers, eggs, and discovering new bird species. The app uses Firebase for authentication and data persistence, supporting both Google Sign-In and email-based authentication.

## Core Features

**Authentication & User Management**
- Firebase-based user authentication (Google Sign-In and email)
- Secure user session management
- User profile persistence with Firestore

**Game System**
- Multi-continent support with continent selection screen
- Progressive level system with unlocking mechanics
- Interactive quiz rounds with multiple-choice questions
- Real-time quiz scoring and feedback
- Game state persistence across sessions

**Collection System**
- Feather collection (common quiz rewards)
- Egg collection (rare rewards)
- Bird species discovery tracking
- Achievement badges tied to collection milestones

**Map & Navigation**
- Platform-specific map implementations:
  - **Android**: React Native Maps with custom bird markers
  - **Web**: Google Maps API integration
- Custom marker system showing birds on continents
- Bird detail cards with images and metadata

**Responsive UI**
- Mobile-first design using NativeWind (Tailwind CSS for React Native)
- Platform-specific layouts (`.native.jsx` files for Android, `.jsx` for web)
- Quiz result animations with Lottie

**State Management**
- MobX-based reactive state model
- Automatic data synchronization with Firestore
- Real-time game progress tracking

## Third-Party Components

This section lists user-visible UI components and libraries written by others that are used in this project.

| Component | Version | Where Used | What It Does |
|-----------|---------|------------|--------------|
| **lottie-react-native** | ^7.3.6 | `src/views/loadingView.jsx`, `src/views/quizRoundView.jsx`, `src/views/quizRoundView.native.jsx`, `src/views/levelCompleteView.jsx` | Renders Lottie JSON animations for the loading screen, quiz answer feedback, and level-completion celebration |
| **react-native-maps** | ^1.27.2 | `src/views/continentMapView.native.jsx` | Interactive map on Android with `MapView`, `Marker`, and `Polyline` to display bird waypoints on each continent |
| **@react-google-maps/api** | ^2.20.8 | `src/views/continentMapView.jsx` | Interactive map on the web using `GoogleMap`, `OverlayView`, and `Polyline` to display bird waypoints |
| **@react-native-google-signin/google-signin** | ^16.1.2 | `src/reactjs/loginPresenter.jsx` | Provides the Google Sign-In button and OAuth flow visible on the login screen |
| **react-native-sound** | ^0.13.0 | `src/views/quizRoundView.native.jsx` | Plays bird call audio during quizzes on Android |
| **nativewind** | ^4.2.3 | All view files in `src/views/` | Tailwind CSS utility classes for styling all UI components across the app |
| **expo-av** | ^16.0.8 | Audio/video playback support | Provides audio infrastructure used alongside react-native-sound |

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native 0.83.2 with Expo 55.0.8 |
| **Navigation** | Expo Router (file-based routing) |
| **State Management** | MobX + MobX React Lite |
| **Styling** | NativeWind (Tailwind CSS for React Native) |
| **Backend** | Firebase (Authentication + Firestore) |
| **Maps** | React Native Maps (Android) + Google Maps API (Web) |
| **Animations** | Lottie React Native |
| **Authentication** | Google Sign-In + Firebase Auth |

## Project Structure

```
src/
├── app/                          # Expo Router app configuration & screens
│   ├── _layout.jsx              # Root navigation layout
│   ├── index.jsx                # Home/splash screen
│   ├── signup.jsx               # User registration screen
│   ├── continents.jsx           # Continent selection screen
│   ├── map.jsx                  # Map screen (routes to platform-specific view)
│   ├── quiz.jsx                 # Quiz screen wrapper
│   └── levelComplete.jsx        # Level completion screen
│
├── views/                        # Screen implementations (presentational components)
│   ├── loginView.jsx            # Web/default login interface
│   ├── signUpView.jsx           # User registration UI
│   ├── homeView.jsx             # Home screen with user stats
│   ├── continentSelectView.jsx  # Continent selection interface
│   ├── continentMapView.jsx     # Web map implementation (Google Maps)
│   ├── continentMapView.native.jsx # Android map with React Native Maps
│   ├── birdDetailView.jsx       # Bird information popup/modal
│   ├── quizRoundView.jsx        # Web quiz question UI
│   ├── quizRoundView.native.jsx # Android quiz variant (with Lottie + Sound)
│   ├── roundResultView.jsx      # Quiz result/feedback display
│   ├── levelCompleteView.jsx    # Level completion celebration screen
│   ├── achievementsView.jsx     # Badges and achievements modal
│   ├── loadingView.jsx          # Loading screen with Lottie animation
│   └── suspenseBoundary.jsx     # Error boundary for async operations
│
├── reactjs/                      # Presenter/container components (logic & state)
│   ├── loginPresenter.jsx       # Login screen logic (Google Sign-In)
│   ├── signUpPresenter.jsx      # Sign-up form handling
│   ├── homePresenter.jsx        # Home screen state & events
│   ├── continentPresenter.jsx   # Continent selection logic
│   ├── mapPresenter.jsx         # Map screen orchestration & quiz launch
│   ├── gamePresenter.jsx        # Quiz round management
│   └── levelCompletePresenter.jsx # Level completion flow
│
├── gameModel.js                 # MobX reactive state model
├── gameUtilities.js             # Game logic helpers (level unlocking, scoring)
├── birdsLevels.js               # Bird data and quiz questions per continent
├── birdSource.js                # Bird image URLs and metadata
├── firestoreModel.js            # Firebase Firestore persistence layer
├── firebaseConfig.js            # Firebase initialization (reads from .env)
├── mobxReactiveModel.js         # MobX observer utilities
└── resolvePromise.js            # Async/await helpers
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Android device or emulator (for native development)
- A Google Firebase project
- A Google Maps API key (required for both web and Android map views)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd amehmeti-bmch-zhangya-vt26-project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Open `.env` and fill in your credentials:

```
# Firebase — get values from Firebase Console > Project Settings > Your apps
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_XENO_CANTO_API_KEY=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Google Maps — get from Google Cloud Console > APIs & Services > Credentials
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_API_KEY=
```

Use a restricted Google Maps key for both Maps variables. For Android, place your own `google-services.json` from Firebase Console in the project root; it is intentionally excluded from Git.

### Running the App

```bash
# Start development server
npm start

# Run on Android emulator or device
npm run android

# Run on web browser
npm run web
```