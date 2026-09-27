// quizRoundView.native.jsx — native quiz screen using react-native-sound

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native";
import Sound from "react-native-sound";
import BirdDetailView from "./birdDetailView";

export default function QuizRoundView({
  question,
  questionNumber,
  totalQuestions,
  choices,
  imageUrl,
  audioUrl,
  imageLoading,
  audioLoading,
  onAnswer,
  onBack,
  selectedAnswer,
  answerOutcome,
  isCorrect,
  reward,
  collectionSummary,
  continent,
  isLastInContinent,
  onNext,
  onGoHome,
  wikiExtract,
}) {
  const soundRef = useRef(null);
  const confettiRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWrongAnimation, setShowWrongAnimation] = useState(false);

  const [soundPressed, setSoundPressed] = useState(false);

  const headers = {
    "User-Agent": "Birdify/1.0",
    "Api-User-Agent": "Birdify/1.0",
  };

  useEffect(function cleanupSoundCB() {
    return function cleanupOnUnmountCB() {
      stopAudio();
    };
  }, []);

  useEffect(
    function resetAudioForQuestionCB() {
      stopAudio();
    },
    [question?.id]
  );

  useEffect(
    function celebrateAnswerCB() {
      if (selectedAnswer) {
        if (isCorrect) {
          setShowConfetti(true);
          setShowWrongAnimation(false);
        } else {
          setShowConfetti(false);
          setShowWrongAnimation(true);
        }
      } else {
        setShowConfetti(false);
        setShowWrongAnimation(false);
      }
    },
    [selectedAnswer, isCorrect]
  );

  function stopAudio() {
    if (!soundRef.current) return;
    soundRef.current.stop(function stopCB() {
      soundRef.current?.release();
      soundRef.current = null;
      setIsAudioPlaying(false);
    });
  }

  function handlePlaySound() {
    if (!audioUrl || audioLoading) return;
    if (soundRef.current) {
      stopAudio();
      return;
    }
    setIsAudioPlaying(true);
    startPlayback(audioUrl, soundRef, setIsAudioPlaying);
  }

  function getSoundButtonStyle() {
    const base = [styles.soundButton];
    if (isAudioPlaying) base.push(styles.soundButtonPlaying);
    else if (audioLoading) base.push(styles.soundButtonLoading);
    else if (!audioUrl) base.push(styles.disabledButton);
    if (soundPressed && audioUrl && !audioLoading) base.push(styles.buttonPressed);
    return base;
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>

      {showConfetti && (
        <View style={styles.confettiOverlay} pointerEvents="none">
          <LottieView
            ref={confettiRef}
            source={require("../assets/animations/Confetti.json")}
            autoPlay
            loop={false}
            onAnimationFinish={() => setShowConfetti(false)}
            style={styles.confettiAnimation}
          />
        </View>
      )}
      {showWrongAnimation && (
        <View style={styles.confettiOverlay} pointerEvents="none">
          <LottieView
            source={require("../assets/animations/Birdy and egg 1.json")}
            autoPlay
            loop={false}
            onAnimationFinish={() => setShowWrongAnimation(false)}
            style={styles.wrongAnimation}
          />
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.65}
          onPress={() => {
            stopAudio();
            onBack();
          }}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.progress}>
        Question {questionNumber}/{totalQuestions}
      </Text>
      <Text style={styles.title}>Identify the bird</Text>
      <Text style={styles.caption}>Use the image or sound clue.</Text>

      <View style={styles.mediaCard}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl, headers: { ...headers } }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              {imageLoading ? "Loading bird image..." : "Image unavailable"}
            </Text>
          </View>
        )}


        <Pressable
          style={getSoundButtonStyle()}
          disabled={!audioUrl || audioLoading}
          onPressIn={() => setSoundPressed(true)}
          onPressOut={() => setSoundPressed(false)}
          onPress={handlePlaySound}
        >
          <Text style={styles.soundButtonText}>
            {audioLoading
              ? "Loading audio..."
              : isAudioPlaying
                ? "⏸ Playing..."
                : "▶  Play bird sound"}
          </Text>
        </Pressable>
      </View>


      {!selectedAnswer && (
        <View style={styles.answersBlock}>
          {choices.map(function choiceCB(choice) {
            return (
              <TouchableOpacity
                key={choice}
                style={styles.choiceButton}
                activeOpacity={0.7}
                onPress={function onPressCB() {
                  onAnswer(choice);
                }}
              >
                <Text style={styles.choiceText}>{choice}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}


      {selectedAnswer && (
        <>
          <Text style={styles.resultTitle}>
            {isCorrect ? "Correct!" : "Not this time"}
          </Text>

          <View
            style={[
              styles.resultBox,
              isCorrect ? styles.correctBox : styles.incorrectBox,
            ]}
          >
            <Text style={styles.resultLabel}>Your answer:</Text>
            <Text style={styles.resultText}>{selectedAnswer}</Text>
          </View>

          {!isCorrect && (
            <View style={[styles.resultBox, styles.correctAnswerBox]}>
              <Text style={styles.resultLabel}>Correct answer:</Text>
              <Text style={styles.resultText}>{question?.commonName}</Text>
            </View>
          )}

          {reward && (
            <View style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>Collectibles earned</Text>
              <Text style={styles.rewardLine}>🪶 Feathers +{reward.feathers}</Text>
              {reward.eggs > 0 && (
                <Text style={styles.rewardLine}>🥚 Eggs +{reward.eggs}</Text>
              )}
            </View>
          )}

          {collectionSummary && (
            <View style={styles.collectionCard}>
              <Text style={styles.collectionTitle}>Collection Progress</Text>
              <Text style={styles.collectionLine}>
                Feathers: {collectionSummary.feathers}
              </Text>
              <Text style={styles.collectionLine}>
                Eggs: {collectionSummary.eggs}
              </Text>
              <Text style={styles.collectionLine}>
                Birds discovered: {collectionSummary.discoveredBirdsCount}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.ghostButton}
            activeOpacity={0.7}
            onPress={function detailsCB() {
              setShowDetails(!showDetails);
            }}
          >
            <Text style={styles.ghostButtonText}>
              {showDetails ? "Hide bird summary" : "More about this bird"}
            </Text>
          </TouchableOpacity>

          {showDetails && (
            <BirdDetailView
              commonName={question?.commonName}
              scientificName={question?.scientificName}
              country={question?.country}
              wikiExtract={wikiExtract}
            />
          )}

          {isLastInContinent ? (
            <View style={styles.completionCard}>
              <Text style={styles.completionEmoji}>🎉</Text>
              <Text style={styles.completionTitle}>Continent Complete!</Text>
              <Text style={styles.completionText}>
                You've discovered all 9 birds in {continent}. Head home and try a new continent!
              </Text>
              <TouchableOpacity
                style={styles.nextButton}
                activeOpacity={0.75}
                onPress={() => { stopAudio(); onGoHome(); }}
              >
                <Text style={styles.nextButtonText}>Go Home 🏠</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.nextButton}
              activeOpacity={0.75}
              onPress={() => { stopAudio(); onNext(); }}
            >
              <Text style={styles.nextButtonText}>Next Question →</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <Text style={styles.smallMeta}>Region: {question?.country}</Text>
    </ScrollView>
  );
}

function startPlayback(audioUrl, soundRef, setIsAudioPlaying) {
  const sound = new Sound(audioUrl, "", function loadCB(error) {
    if (error) {
      sound.release();
      setIsAudioPlaying?.(false);
      return;
    }
    sound.play(function playCB() {
      sound.release();
      if (soundRef.current === sound) {
        soundRef.current = null;
      }
      setIsAudioPlaying?.(false);
    });
  });
  soundRef.current = sound;
}

const styles = StyleSheet.create({
  screen: {
    minHeight: "100%",
    backgroundColor: "#f3f7ef",
    padding: 22,
    paddingTop: 28,
  },
  header: { flexDirection: "row", marginBottom: 12 },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(47, 93, 47, 0.1)",
  },
  backButtonText: { color: "#2f5d2f", fontWeight: "700", fontSize: 14 },
  progress: { color: "#607256", fontWeight: "600" },
  title: { marginTop: 6, fontSize: 28, fontWeight: "800", color: "#1f2a16" },
  caption: { marginTop: 4, marginBottom: 16, color: "#5a6750" },
  mediaCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d6dfc8",
    backgroundColor: "#fff",
    padding: 12,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: "#d8e2ca",
  },
  imagePlaceholder: {
    height: 300,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2e8d6",
    paddingHorizontal: 12,
  },
  placeholderText: { color: "#4f5d43", fontWeight: "600" },
  soundButton: {
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: "#2d5d2a",
    paddingVertical: 12,
    alignItems: "center",
  },
  soundButtonPlaying: { backgroundColor: "#e74c3c" },
  soundButtonLoading: { backgroundColor: "#f39c12" },
  disabledButton: { backgroundColor: "#7c8c75" },
  buttonPressed: { opacity: 0.65 },
  soundButtonText: { color: "#fff", fontWeight: "700" },
  answersBlock: { marginTop: 16, gap: 10 },
  choiceButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cfd9c0",
    backgroundColor: "#fff",
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  choiceText: { fontSize: 15, fontWeight: "600", color: "#283621" },
  resultTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#203017",
    marginBottom: 12,
    marginTop: 16,
  },
  resultBox: { marginTop: 16, padding: 14, borderRadius: 12, borderWidth: 2 },
  correctBox: { backgroundColor: "#e7f5e0", borderColor: "#27ae60" },
  incorrectBox: { backgroundColor: "#ffe7e7", borderColor: "#e74c3c" },
  correctAnswerBox: {
    marginTop: 10,
    backgroundColor: "#e7f5e0",
    borderColor: "#27ae60",
  },
  resultLabel: { fontSize: 12, fontWeight: "600", color: "#555", marginBottom: 4 },
  resultText: { fontSize: 16, fontWeight: "700", color: "#203017" },
  rewardCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#e7f4da",
    borderWidth: 1,
    borderColor: "#bad9a3",
  },
  rewardTitle: { fontWeight: "700", color: "#2a5124" },
  rewardLine: { marginTop: 4, color: "#355d2d" },
  collectionCard: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d2dcc4",
    backgroundColor: "#fff",
    padding: 12,
  },
  collectionTitle: { fontWeight: "700", color: "#2f4028" },
  collectionLine: { marginTop: 4, color: "#5f6f56" },
  nextButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#2f5d2f",
    paddingVertical: 13,
    alignItems: "center",
  },
  nextButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  confettiOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: "rgba(255,255,255,0)",
  },
  confettiAnimation: { width: 280, height: 280 },
  wrongAnimation: { width: 260, height: 260 },
  ghostButton: {
    marginTop: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#9ab084",
    paddingVertical: 11,
    alignItems: "center",
  },
  ghostButtonText: { color: "#35572e", fontWeight: "700" },
  smallMeta: { marginTop: 18, color: "#6b785f", marginBottom: 30 },
  completionCard: {
    marginTop: 20, borderRadius: 16, backgroundColor: "#e8f5e0",
    borderWidth: 1, borderColor: "#a8d48a", padding: 20, alignItems: "center",
  },
  completionEmoji: { fontSize: 40, marginBottom: 8 },
  completionTitle: { fontSize: 22, fontWeight: "800", color: "#1f4620", marginBottom: 6 },
  completionText: { fontSize: 14, color: "#3a5c30", textAlign: "center", lineHeight: 20, marginBottom: 16 },
});