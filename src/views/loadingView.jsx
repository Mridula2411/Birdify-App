// loadingView.jsx
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingView({ message = "Loading your adventure..." }) {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <LottieView
          source={require("../assets/animations/Bird.json")}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.message}>{message}</Text>
        <View style={styles.dotsContainer}>
          <Text style={styles.dots}>●</Text>
          <Text style={styles.dots}>●</Text>
          <Text style={styles.dots}>●</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f7ef",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 250,
    height: 250,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2f5d2f",
    marginTop: 24,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  dots: {
    fontSize: 20,
    color: "#2f5d2f",
    opacity: 0.6,
  },
});
