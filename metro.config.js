// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// react-native-maps uses codegenNativeComponent which doesn't exist in
// react-native-web. Block the entire package on web so Metro resolves to
// the empty module instead of crashing at runtime.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === "web" && moduleName.startsWith("react-native-maps")) {
        return { type: "empty" };
    }
    if (platform === "web" && moduleName === "@firebase/app") {
        return {
            filePath: path.resolve(__dirname, "node_modules/@firebase/app/dist/esm/index.esm.js"),
            type: "sourceFile",
        };
    }
    if (platform === "web" && moduleName === "@firebase/firestore") {
        return {
            filePath: path.resolve(__dirname, "node_modules/@firebase/firestore/dist/index.esm.js"),
            type: "sourceFile",
        };
    }
    if (originalResolveRequest) {
        return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
