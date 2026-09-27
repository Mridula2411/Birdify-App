import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image, LayoutAnimation, Platform, UIManager } from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CONTINENT_IMAGES = {
  africa:        require("../assets/images/african-bird.webp"),
  europe:        require("../assets/images/European-bird.jpg"),
  asia:          require("../assets/images/asian-bird.webp"),
  "north america": require("../assets/images/north american-bird.jpg"),
  "south america": require("../assets/images/south american-bird.jpeg"),
  oceania:       require("../assets/images/oceania-bird.jpg"),
  antarctica:    require("../assets/images/antarctica bird.jpg"),
};

function getContinentImage(name) {
  return CONTINENT_IMAGES[name?.toLowerCase()] ?? null;
}

const TUTORIAL_STEPS = [
  {
    emoji: "🌍",
    title: "Choose a Continent",
    description: "Pick any continent below and begin your bird discovery route.",
    bg: "#2f5d2f",
    textColor: "#e8f5e2",
  },
  {
    emoji: "🗺️",
    title: "Navigate the Map",
    description: "Follow waypoints on an interactive map through the continent.",
    bg: "#3d6b52",
    textColor: "#e0f0e8",
  },
  {
    emoji: "🐦",
    title: "Discover Birds",
    description: "Answer quiz questions at each stop to unlock new bird species.",
    bg: "#4a7560",
    textColor: "#dff0e8",
  },
  {
    emoji: "🏆",
    title: "Bird Mastery",
    description: "Finish all questions per continent to master your region.",
    bg: "#5c6e3a",
    textColor: "#eaf2d8",
  },
  {
    emoji: "🪶",
    title: "Build Collection",
    description: "Earn feathers per bird discovered, and eggs as milestone bonuses every 3 birds.",
    bg: "#486640",
    textColor: "#e4f0db",
  },
];

export default function ContinentSelectView({ continents, levelsCompleted, onSelectContinent, onSignOut, user }) {
  const displayName = user?.displayName || "Explorer";
  const avatar = user?.photoURL || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png";
  const [tutorialOpen, setTutorialOpen] = useState(false);

  function toggleTutorial() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTutorialOpen(function(prev) { return !prev; });
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {/* User Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{displayName}</Text>
        </View>
        {onSignOut && (
          <Pressable
            onPress={onSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            {({ pressed }) => (
              <View style={[styles.signOutButton, pressed && styles.signOutButtonPressed]}>
                <Text style={styles.signOutButtonText}>Sign out ➡️</Text>
              </View>
            )}
          </Pressable>
        )}
      </View>

      {/* First-Time Tutorial Banner */}
      <View style={styles.tutorialBanner}>
        <Pressable
          onPress={toggleTutorial}
          accessibilityRole="button"
          accessibilityLabel="Toggle how Birdify works"
        >
          {({ pressed }) => (
            <View style={[styles.tutorialToggleRow, pressed && styles.tutorialBannerPressed]}>
              <Text style={styles.tutorialBadgeText}>👋 First time here?</Text>
              <Text style={styles.tutorialChevron}>{tutorialOpen ? "▲" : "▼"}</Text>
            </View>
          )}
        </Pressable>

        {tutorialOpen && (
          <View>
            <Text style={styles.tutorialHeading}>Here's how Birdify works</Text>
            <Text style={styles.tutorialSubtitle}>
              Explore continents, discover birds along the route, and grow your collection.
            </Text>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tutorialCardsContainer}
            >
              {TUTORIAL_STEPS.map(function renderStepCB(step, index) {
                return (
                  <View key={index} style={[styles.tutorialCard, { backgroundColor: step.bg }]}>
                    <Text style={styles.tutorialCardEmoji}>{step.emoji}</Text>
                    <Text style={[styles.tutorialCardTitle, { color: step.textColor }]}>{step.title}</Text>
                    <Text style={[styles.tutorialCardDesc, { color: step.textColor }]}>{step.description}</Text>
                  </View>
                );
              })}
            </ScrollView>
            <Text style={styles.tutorialHint}>Feathers are earned for each new bird discovered. Eggs are bonus rewards for every 3 birds you find.</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>Choose a Continent</Text>
      <Text style={styles.subtitle}>Start your bird discovery route.</Text>

      {continents.map(function renderContinentCB(continent) {
        const completed = levelsCompleted(continent);
        const image = getContinentImage(continent);
        return (
          <Pressable
            key={continent}
            onPress={() => onSelectContinent(continent)}
            accessibilityRole="button"
            accessibilityLabel={`Explore ${continent}`}
          >
            {({ pressed }) => (
              <View style={[styles.card, pressed && styles.cardPressed]}>
                {image && (
                  <View style={styles.cardThumbWrapper}>
                    <Image source={image} style={styles.cardThumb} resizeMode="cover" accessibilityLabel={continent} />
                  </View>
                )}
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{continent}</Text>
                  <Text style={styles.cardMeta}>Birds discovered: {completed}/9</Text>
                </View>
                <Text style={styles.enter}>→</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 24, gap: 14, backgroundColor: "#f5f8ef", minHeight: "100%" },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10, marginTop: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: "#ccc" },
  headerInfo: { flex: 1 },
  greeting: { fontSize: 14, color: "#566246" },
  userName: { fontSize: 20, fontWeight: "bold", color: "#1f2a16" },
  signOutButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#2f5d2f", elevation: 2, shadowColor: "#000", shadowOpacity: 0.10, shadowRadius: 3 },
  signOutButtonPressed: { backgroundColor: "#e4f0e0", opacity: 0.9 },
  signOutButtonText: { color: "#2f5d2f", fontWeight: "700", fontSize: 13 },

  // Tutorial Banner
  tutorialBanner: {
    backgroundColor: "#edf4e5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c8ddb8",
  },
  tutorialBannerPressed: { backgroundColor: "#e2edd8" },
  tutorialToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  tutorialChevron: { fontSize: 12, color: "#2f5d2f", fontWeight: "700" },
  tutorialBadgeText: { fontSize: 13, fontWeight: "700", color: "#2f5d2f" },
  tutorialHeading: { fontSize: 20, fontWeight: "800", color: "#1f2a16", paddingHorizontal: 18, marginBottom: 4, marginTop: 4 },
  tutorialSubtitle: { fontSize: 13, color: "#566246", paddingHorizontal: 18, marginBottom: 16, lineHeight: 18 },
  tutorialCardsContainer: { paddingHorizontal: 18, paddingBottom: 20, gap: 10 },
  tutorialCard: {
    width: 160,
    borderRadius: 16,
    padding: 16,
    justifyContent: "flex-end",
    minHeight: 160,
  },
  tutorialCardEmoji: { fontSize: 36, marginBottom: 10 },
  tutorialCardTitle: { fontSize: 14, fontWeight: "800", marginBottom: 5 },
  tutorialHint: { paddingHorizontal: 18, marginTop: 10, marginBottom: 18, fontSize: 13, color: "#4f6447", lineHeight: 18 },
  tutorialCardDesc: { fontSize: 12, lineHeight: 17, opacity: 0.9 },

  title: { fontSize: 30, fontWeight: "800", color: "#1f2a16" },
  subtitle: { fontSize: 16, color: "#566246", marginBottom: 10 },
  card: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#d5dfc6", flexDirection: "row", alignItems: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4 },
  cardHovered: { backgroundColor: "#f0f7e8", borderColor: "#2f5d2f", shadowColor: "#2f5d2f", shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  cardPressed: { backgroundColor: "#e4f0db", borderColor: "#1f4620", opacity: 0.92 },
  cardThumbWrapper: { width: 80, height: 80, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, overflow: "hidden" },
  cardThumb: { width: 80, height: 80 },
  cardBody: { flex: 1, paddingHorizontal: 14, paddingVertical: 14 },
  cardTitle: { fontSize: 19, fontWeight: "700", color: "#1f2a16" },
  cardMeta: { marginTop: 4, fontSize: 14, color: "#6a755b" },
  enter: { fontWeight: "700", color: "#2f5d2f", paddingRight: 16, fontSize: 18 },
});
