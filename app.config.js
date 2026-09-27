import { existsSync } from "node:fs";

export default {
  expo: {
    name: "birdify",
    slug: "project",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "birdify",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.group2.birdify",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
      },
      googleServicesFile: existsSync("./google-services.json") ? "./google-services.json" : undefined,
      edgeToEdgeEnabled: true,
      package: "com.group2.birdify",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
    },
    plugins: [
      "expo-router",
      "expo-image",
      "expo-web-browser",
      "@react-native-google-signin/google-signin",
    ],
    extra: {
      router: {},
      eas: {
        projectId: "30830b10-c62b-4e4f-965d-0161253c9953",
      },
    },
    owner: "vent1",
  },
};
