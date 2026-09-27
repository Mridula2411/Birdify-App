import { observer } from "mobx-react-lite";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { reactiveModel } from "../mobxReactiveModel";
import LoadingView from "../views/loadingView";

const RootLayout = observer(function RootLayout() {
    if (!reactiveModel.ready) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safe}>
                    <LoadingView message="Preparing your bird adventure..." />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safe}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="continents" />
                    <Stack.Screen name="map" />
                    <Stack.Screen name="quiz" />
                    <Stack.Screen name="levelComplete" />
                </Stack>
            </SafeAreaView>
        </SafeAreaProvider>
    );
});

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f2f7eb" },
});

export default RootLayout;
