import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeView({ onStartJourney }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Birdify</Text>
            <TouchableOpacity style={styles.button} onPress={onStartJourney}>
                <Text style={styles.buttonText}>Start Journey</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#2e7d32",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});
