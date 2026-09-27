// roundResultView.jsx

import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, ScrollView } from "react-native";
import BirdDetailView from "./birdDetailView";

export default function RoundResultView({
  question,
  selectedAnswer,
  isCorrect,
  imageUrl,
  wikiExtract,
  reward,
  collectionSummary,
  isLastQuestion,
  onNext,
  onBack,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const headers = {
    'User-Agent': 'Birdify/1.0',
    'Api-User-Agent': 'Birdify/1.0'
  };
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>
      <Text style={styles.resultTitle}>{isCorrect ? "Correct!" : "Not this time"}</Text>
      <View style={[styles.answerBox, isCorrect ? styles.correctBox : styles.incorrectBox]}>
        <Text style={styles.answerLabel}>Your answer:</Text>
        <Text style={styles.answerText}>{selectedAnswer}</Text>
      </View>
      {!isCorrect && (
        <View style={styles.correctAnswerBox}>
          <Text style={styles.answerLabel}>Correct answer:</Text>
          <Text style={styles.answerText}>{question?.commonName}</Text>
        </View>
      )}

      {!!imageUrl && <Image source={{ uri: imageUrl, headers: { ...headers } }} style={styles.image} resizeMode="cover" />}

      {!!reward && (
        <View style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>Collectibles earned</Text>
          <Text style={styles.rewardHint}>🪶 Feathers = 1 per new bird discovered</Text>
          <Text style={styles.rewardHint}>🥚 Eggs = milestone bonus every 3 birds</Text>
          <Text style={styles.rewardLine}>🪶 Feathers +{reward.feathers}</Text>
          {reward.eggs > 0 && <Text style={styles.rewardLine}>🥚 Eggs +{reward.eggs}</Text>}
        </View>
      )}

      {!!collectionSummary && (
        <View style={styles.collectionCard}>
          <Text style={styles.collectionTitle}>Collection Progress</Text>
          <Text style={styles.collectionLine}>Feathers: {collectionSummary.feathers}</Text>
          <Text style={styles.collectionLine}>Eggs: {collectionSummary.eggs}</Text>
          <Text style={styles.collectionLine}>Birds discovered: {collectionSummary.discoveredBirdsCount}</Text>
          <Text style={styles.collectionHint}>Feathers track each bird discovered. Eggs are bonus rewards for every 3 birds.</Text>
        </View>
      )}

      <Pressable
        style={styles.ghostButton}
        onPress={function detailsCB() { setShowDetails(!showDetails); }}
      >
        <Text style={styles.ghostButtonText}>{showDetails ? "Hide bird summary" : "More about this bird"}</Text>
      </Pressable>

      {showDetails && (
        <BirdDetailView
          commonName={question?.commonName}
          scientificName={question?.scientificName}
          country={question?.country}
          imageUrl={imageUrl}
          wikiExtract={wikiExtract}
        />
      )}

      <Pressable style={styles.primaryButton} onPress={onNext}>
        <Text style={styles.primaryButtonText}>{isLastQuestion ? "Finish level" : "Next challenge"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { minHeight: "100%", backgroundColor: "#f4f8ef", padding: 22, paddingTop: 28 },
  header: { flexDirection: "row", marginBottom: 16 },
  backButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "rgba(47, 93, 47, 0.1)" },
  backButtonText: { color: "#2f5d2f", fontWeight: "700", fontSize: 14 },
  resultTitle: { fontSize: 30, fontWeight: "800", color: "#203017" },
  answerBox: { marginTop: 12, padding: 14, borderRadius: 12, borderWidth: 2 },
  correctBox: { backgroundColor: "#e7f5e0", borderColor: "#27ae60" },
  incorrectBox: { backgroundColor: "#ffe7e7", borderColor: "#e74c3c" },
  correctAnswerBox: { marginTop: 10, padding: 14, borderRadius: 12, borderWidth: 2, backgroundColor: "#e7f5e0", borderColor: "#27ae60" },
  answerLabel: { fontSize: 12, fontWeight: "600", color: "#555", marginBottom: 4 },
  answerText: { fontSize: 16, fontWeight: "700", color: "#203017" },
  resultCopy: { marginTop: 6, color: "#56634c", fontSize: 15 },
  image: {
    width: "100%", height: 210, marginTop: 16,
    borderRadius: 12, backgroundColor: "#dae2ce",
  },
  rewardCard: {
    marginTop: 14, padding: 12, borderRadius: 12,
    backgroundColor: "#e7f4da", borderWidth: 1, borderColor: "#bad9a3",
  },
  rewardTitle: { fontWeight: "700", color: "#2a5124" },
  rewardHint: { marginTop: 4, color: "#4f6447", fontSize: 12, lineHeight: 16 },
  rewardLine: { marginTop: 6, color: "#355d2d" },
  collectionCard: {
    marginTop: 12, borderRadius: 12, borderWidth: 1,
    borderColor: "#d2dcc4", backgroundColor: "#fff", padding: 12,
  },
  collectionTitle: { fontWeight: "700", color: "#2f4028" },
  collectionLine: { marginTop: 4, color: "#5f6f56" },
  collectionHint: { marginTop: 10, color: "#5b6a53", fontSize: 12, lineHeight: 16 },
  ghostButton: {
    marginTop: 14, borderRadius: 10, borderWidth: 1,
    borderColor: "#9ab084", paddingVertical: 11, alignItems: "center",
  },
  ghostButtonText: { color: "#35572e", fontWeight: "700" },
  primaryButton: {
    marginTop: 16, borderRadius: 12,
    backgroundColor: "#2f5d2f", paddingVertical: 13, alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
