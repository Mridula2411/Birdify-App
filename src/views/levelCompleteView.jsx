// levelCompleteView.jsx

import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import BirdDetailView from "./birdDetailView";

export default function LevelCompleteView({
  continent,
  questionNumber,
  collectionSummary,
  lastDiscoveredBird,
  perfectRun,
  canPlayNextLevel,
  onBackToMap,
  onPlayNext,
}) {
  const [showTrophy, setShowTrophy] = useState(false);

  useEffect(() => {
    if (perfectRun) {
      setShowTrophy(true);
    }
  }, [perfectRun]);

  return (
    <View style={styles.container}>
      {showTrophy && (
        <View style={styles.trophyOverlay} pointerEvents="none">
          <LottieView
            source={require("../assets/animations/Confetti & trophy.json")}
            autoPlay
            loop={false}
            onAnimationFinish={() => setShowTrophy(false)}
            style={styles.trophyAnimation}
          />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.title}>Bird Discovered!</Text>
        <Text style={styles.subtitle}>{continent} · Bird {questionNumber} of 9</Text>
        {perfectRun && <Text style={styles.trophyMessage}>Correct answer! Trophy unlocked 🏆</Text>}

        {!!collectionSummary && (
          <View style={styles.collectionCard}>
            <Text style={styles.collectionTitle}>Your Collection</Text>
            <Text style={styles.collectionLine}>🪶 Feathers: {collectionSummary.feathers}</Text>
            <Text style={styles.collectionLine}>🥚 Eggs: {collectionSummary.eggs}</Text>
            <Text style={styles.collectionLine}>Birds discovered: {collectionSummary.discoveredBirdsCount}</Text>
            <Text style={styles.collectionHint}>Feathers are earned per new bird. Eggs are milestone rewards every 3 discoveries.</Text>
          </View>
        )}

        {!!lastDiscoveredBird && (
          <BirdDetailView
            commonName={lastDiscoveredBird.commonName}
            scientificName={lastDiscoveredBird.scientificName}
            country={lastDiscoveredBird.country}
            imageUrl={lastDiscoveredBird.imageUrl}
            wikiExtract={lastDiscoveredBird.wikiExtract}
          />
        )}

        {canPlayNextLevel && (
          <Pressable style={styles.primaryButton} onPress={onPlayNext}>
            <Text style={styles.primaryButtonText}>Next Bird</Text>
          </Pressable>
        )}

        <Pressable style={styles.secondaryButton} onPress={onBackToMap}>
          <Text style={styles.secondaryButtonText}>Back to map</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { minHeight: "100%", backgroundColor: "#f2f7eb", padding: 22, paddingTop: 30 },
  title: { fontSize: 31, fontWeight: "800", color: "#1f2d18" },
  subtitle: { marginTop: 4, color: "#607055", fontSize: 15 },
  collectionCard: {
    marginTop: 16, borderRadius: 12, borderWidth: 1,
    borderColor: "#d0dbc0", backgroundColor: "#fff", padding: 12,
  },
  collectionTitle: { fontWeight: "700", color: "#2b4023" },
  collectionLine: { marginTop: 5, color: "#58694d" },
  collectionHint: { marginTop: 10, color: "#5b6a53", fontSize: 12, lineHeight: 16 },
  primaryButton: {
    marginTop: 16, borderRadius: 11, backgroundColor: "#2f5d2f",
    alignItems: "center", paddingVertical: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryButton: {
    marginTop: 10, borderRadius: 11, borderWidth: 1,
    borderColor: "#9bb086", alignItems: "center", paddingVertical: 12,
  },
  secondaryButtonText: { color: "#33572e", fontWeight: "700" },
  secondaryButtonHovered: { backgroundColor: "#e8f1dc", borderColor: "#7c9f66" },
  secondaryButtonPressed: { backgroundColor: "#d5e3c3", opacity: 0.85 },
  buttonHovered: { opacity: 0.95 },
  buttonPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  container: { flex: 1, backgroundColor: "#f2f7eb" },
  trophyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  trophyAnimation: {
    width: 280,
    height: 280,
  },
  trophyMessage: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#2f5d2f",
    textAlign: "center",
  },
});
