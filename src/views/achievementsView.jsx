import { View, Text, Modal, Pressable, FlatList, Image, StyleSheet } from "react-native";

const BADGES = [
  // Feathers
  { id: "feather_1",  label: "First Feather",    desc: "Collect your first feather",  image: require("../assets/images/first_feather.jpeg"),  check: (c) => c.feathers >= 1 },
  { id: "feather_5",  label: "Feather Collector", desc: "Collect 5 feathers",           image: require("../assets/images/feather_collector.jpeg"), check: (c) => c.feathers >= 5 },
  { id: "feather_10", label: "Feather Fan",       desc: "Collect 10 feathers",          image: require("../assets/images/feather_fan.jpeg"),       check: (c) => c.feathers >= 10 },
  { id: "feather_25", label: "Feather Hoarder",   desc: "Collect 25 feathers",          image: require("../assets/images/feather_hoarder.jpeg"),   check: (c) => c.feathers >= 25 },
  // Eggs
  { id: "egg_1",  label: "First Egg",    desc: "Find your first egg",  image: require("../assets/images/first_egg.jpeg"),  check: (c) => c.eggs >= 1 },
  { id: "egg_5",  label: "Egg Hunter",   desc: "Find 5 eggs",          image: require("../assets/images/egg_hunter.jpeg"),   check: (c) => c.eggs >= 5 },
  { id: "egg_10", label: "Nest Raider",  desc: "Find 10 eggs",         image: require("../assets/images/nest_raider.jpeg"),  check: (c) => c.eggs >= 10 },
  { id: "egg_25", label: "Egg Expert",   desc: "Find 25 eggs",         image: require("../assets/images/egg_expert.jpeg"),   check: (c) => c.eggs >= 25 },
  // Birds discovered
  { id: "bird_1",  label: "First Discovery", desc: "Discover your first bird",  image: require("../assets/images/first_discovery.jpeg"), check: (c) => c.discoveredBirdsCount >= 1 },
  { id: "bird_5",  label: "Bird Watcher",    desc: "Discover 5 birds",          image: require("../assets/images/bird_watcher.jpeg"),   check: (c) => c.discoveredBirdsCount >= 5 },
  { id: "bird_10", label: "Ornithologist",   desc: "Discover 10 birds",         image: require("../assets/images/ornithologist.jpeg"),  check: (c) => c.discoveredBirdsCount >= 10 },
  { id: "bird_20", label: "Bird Expert",     desc: "Discover 20 birds",         image: require("../assets/images/bird_expert.jpeg"),   check: (c) => c.discoveredBirdsCount >= 20 },
  { id: "bird_50", label: "Master Birder",   desc: "Discover 50 birds",         image: require("../assets/images/master_birder.jpeg"), check: (c) => c.discoveredBirdsCount >= 50 },
];

function BadgeCard({ badge, earned }) {
  return (
    <View style={[styles.badgeCard, !earned && styles.badgeCardLocked]}>
      {earned ? (
        <Image source={badge.image} style={styles.badgeImage} />
      ) : (
        <Text style={[styles.badgeEmoji, !earned && styles.badgeEmojiLocked]}>🔒</Text>
      )}
      <Text style={[styles.badgeLabel, !earned && styles.badgeLabelLocked]} numberOfLines={2}>
        {earned ? badge.label : "???"}
      </Text>
      {earned && (
        <Text style={styles.badgeDesc} numberOfLines={2}>{badge.desc}</Text>
      )}
    </View>
  );
}

export default function AchievementsView({ visible, onClose, collectionSummary }) {
  const collection = collectionSummary ?? { feathers: 0, eggs: 0, discoveredBirdsCount: 0 };
  const earnedCount = BADGES.filter(function checkCB(b) { return b.check(collection); }).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>🏅 Achievements</Text>
              <Text style={styles.subtitle}>{earnedCount} / {BADGES.length} badges earned</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              onPress={onClose}
              accessibilityLabel="Close"
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🪶</Text>
              <Text style={styles.statValue}>{collection.feathers}</Text>
              <Text style={styles.statLabel}>Feathers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🥚</Text>
              <Text style={styles.statValue}>{collection.eggs}</Text>
              <Text style={styles.statLabel}>Eggs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🐦</Text>
              <Text style={styles.statValue}>{collection.discoveredBirdsCount}</Text>
              <Text style={styles.statLabel}>Birds</Text>
            </View>
          </View>

          {/* Badge grid */}
          <FlatList
            style={styles.badgesScroll}
            data={BADGES}
            keyExtractor={(badge) => badge.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item: badge }) => {
              const earned = badge.check(collection);
              return <BadgeCard badge={badge} earned={earned} />;
            }}
          />

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#f5f8ef",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "800", color: "#1f2a16" },
  subtitle: { fontSize: 13, color: "#566246", marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e4edd8", alignItems: "center", justifyContent: "center" },
  closeBtnPressed: { backgroundColor: "#cddbb8", opacity: 0.85 },
  closeBtnText: { color: "#2f5d2f", fontWeight: "700", fontSize: 14 },

  // Stats
  statsRow: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#d5dfc6", paddingVertical: 14, marginBottom: 18 },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 20, fontWeight: "800", color: "#1f2a16" },
  statLabel: { fontSize: 11, color: "#6a755b", fontWeight: "600" },
  statDivider: { width: 1, backgroundColor: "#d5dfc6" },

  // Badge grid
  grid: { paddingBottom: 8 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 10 },
  badgesScroll: {
    flexGrow: 1,
    minHeight: 0,
  },
  badgeCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#c8ddb8",
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
    minHeight: 180,
  },
  badgeCardLocked: { backgroundColor: "#f0f0f0", borderColor: "#ddd" },
  badgeEmoji: { fontSize: 30 },
  badgeEmojiLocked: { opacity: 0.4 },
  badgeImage: { width: 72, height: 72, borderRadius: 12, marginBottom: 10, resizeMode: "contain" },
  badgeLabel: { fontSize: 12, fontWeight: "700", color: "#1f2a16", textAlign: "center" },
  badgeLabelLocked: { color: "#aaa" },
  badgeDesc: { fontSize: 10, color: "#6a755b", textAlign: "center", lineHeight: 14 },
});
