import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { View, Text, Image, Pressable, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import AchievementsView from "./achievementsView";

const headers = {
  'User-Agent': 'Birdify/1.0',
  'Api-User-Agent': 'Birdify/1.0'
};

function CustomMarker({ waypoint, isStart, teeterValue }) {
  if (waypoint.status === "completed" && waypoint.discoveredImage) {
    return (
      <View style={markerStyles.photoPin}>
        <View style={markerStyles.placeholderContent}>
          <Text style={markerStyles.placeholderEmoji}>🐦</Text>
        </View>
      </View>
    );
  }
  if (waypoint.status === "locked") {
    return (
      <View style={[markerStyles.pin, markerStyles.pinLocked]}>
        <Text style={markerStyles.pinText}>🔒</Text>
      </View>
    );
  }

  if (isStart) {
    const animatedStyle = teeterValue ? {
      transform: [
        {
          rotate: teeterValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['-8deg', '8deg'],
          }),
        },
      ],
    } : {};
    return (
      <Animated.View style={[markerStyles.birdMarker, animatedStyle]}>
        <Text style={markerStyles.birdEmoji}>🐦</Text>
      </Animated.View>
    );
  }

  return (
    <View style={[markerStyles.pin, markerStyles.pinCurrent]}>
      <Text style={markerStyles.pinText}>?</Text>
      <View style={markerStyles.pinTail} />
    </View>
  );
}

const markerStyles = StyleSheet.create({
  pin: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 2.5, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4, elevation: 6 },
  pinCurrent: { backgroundColor: "#e67e22" },
  pinLocked: { backgroundColor: "#8b9589" },
  pinText: { fontSize: 16, fontWeight: "900", color: "#fff" },
  pinTail: { position: "absolute", bottom: -8, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 10, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#e67e22" },
  photoPin: { width: 46, height: 46, borderRadius: 23, borderWidth: 3, borderColor: "#2f5d2f", backgroundColor: "#e8f5e9", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  birdMarker: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", backgroundColor: "#fff9e6", borderWidth: 2, borderColor: "#ffd700", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 6, elevation: 8 },
  birdEmoji: { fontSize: 28 },
  placeholderContent: {
    width: "100%",
    height: "100%",
    borderRadius: 23,
    backgroundColor: "#2f5d2f",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 24,
    color: "#fff",
  },
});

const STATUS_LABEL = { completed: "✓ Discovered", current: "? Unlocked", locked: "🔒 Locked" };

export default function ContinentMapView({ continent, waypoints, collectionSummary, onSelectQuestion, onSignOut, onHome }) {
  const insets = useSafeAreaInsets();

  // Find the first unlocked-but-unanswered waypoint so we can focus the map on it.
  const activeWaypoint = useMemo(function activeWaypointMemoCB() {
    if (!waypoints) return null;
    return waypoints.find(w => w.status === "current") ?? null;
  }, [waypoints]);

  const [selected, setSelected] = useState(activeWaypoint);
  const [showAchievements, setShowAchievements] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const teeterValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(function startPulseCB() {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, { toValue: 1.1, duration: 650, useNativeDriver: false }),
        Animated.timing(pulseValue, { toValue: 1, duration: 650, useNativeDriver: false }),
      ]),
      { iterations: 3 }
    );
    anim.start();
    return () => anim.stop();
  }, [pulseValue]);

  useFocusEffect(useCallback(function onFocusCB() {
    const timer = setTimeout(function readyCB() { setMapReady(true); }, 150);
    return function cleanup() { clearTimeout(timer); };
  }, []));

  useEffect(function startTeeterCB() {
    const teeterAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(teeterValue, { toValue: 1, duration: 600, useNativeDriver: false }),
        Animated.timing(teeterValue, { toValue: 0, duration: 600, useNativeDriver: false }),
      ])
    );
    teeterAnimation.start();
    return () => teeterAnimation.stop();
  }, [teeterValue]);

  const region = useMemo(function regionMemoCB() {
    if (!waypoints || waypoints.length === 0) return null;

    // If there is an active (next) waypoint, zoom in on it so the user lands right there.
    if (activeWaypoint) {
      return {
        latitude: activeWaypoint.lat,
        longitude: activeWaypoint.lng,
        latitudeDelta: 12,
        longitudeDelta: 12,
      };
    }

    // All birds discovered — show the full continent.
    const lats = waypoints.map(w => w.lat);
    const lngs = waypoints.map(w => w.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(maxLat - minLat, 5) * 1.5,
      longitudeDelta: Math.max(maxLng - minLng, 5) * 1.5,
    };
  }, [waypoints, activeWaypoint]);

  const routePath = useMemo(() => {
    if (!waypoints || waypoints.length === 0) return [];
    return [...waypoints]
      .sort((a, b) => a.gameQuestion - b.gameQuestion)
      .map(w => ({ latitude: w.lat, longitude: w.lng }));
  }, [waypoints]);

  if (!waypoints || waypoints.length === 0 || !region) return null;

  const collection = collectionSummary ?? { feathers: 0, eggs: 0, discoveredBirdsCount: 0 };

  return (
    <View style={styles.screen}>
      {!mapReady && (
        <View style={[styles.map, { backgroundColor: "#c8dfc8", justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ color: "#2f5d2f", fontWeight: "600" }}>Loading map...</Text>
        </View>
      )}
      {mapReady && (
        <MapView style={styles.map} initialRegion={region} toolbarEnabled={false}>
          <Polyline
            coordinates={routePath}
            strokeColor="#2f5d2f"
            strokeWidth={5}
            strokeOpacity={0.9}
          />
          {waypoints.map((wp, index) => {
            const isStart = index === 0 && waypoints.length > 0;
            return (
              <Marker
                key={String(wp.gameQuestion)}
                coordinate={{ latitude: wp.lat, longitude: wp.lng }}
                tracksViewChanges={true}
                onPress={() => setSelected(wp)}
              >
                <CustomMarker
                  waypoint={wp}
                  isStart={isStart}
                  teeterValue={teeterValue}
                />
              </Marker>
            );
          })}
        </MapView>
      )}

      {!!selected && (
        <View style={styles.stopCard}>
          <View style={styles.stopCardHeader}>
            <View style={styles.stopCardTitles}>
              <Text style={styles.stopTitle}>{selected.status === "completed" ? selected.commonName : "Unknown Bird"}</Text>
              <Text style={styles.stopMeta}>{selected.country} · Stop {selected.gameQuestion}</Text>
            </View>
            <Pressable onPress={() => setSelected(null)} style={styles.dismissBtn}>
              <Text style={styles.dismissBtnText}>✕</Text>
            </Pressable>
          </View>

          <View style={[styles.statusBadge, selected.status === "completed" && styles.badgeCompleted, selected.status === "locked" && styles.badgeLocked]}>
            <Text style={styles.statusBadgeText}>{STATUS_LABEL[selected.status]}</Text>
          </View>

          {selected.status === "completed" && !!selected.discoveredImage && (
            <Image
              source={{ uri: selected.discoveredImage, headers: { ...headers } }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}

          <Pressable
            style={[
              styles.launchButton,
              selected.status === "locked" ? styles.launchButtonLocked : null
            ]}
            disabled={selected.status === "locked"}
            onPress={() => onSelectQuestion(selected.gameQuestion)}
          >
            <Text style={styles.launchButtonText}>
              {selected.status === "locked" ? "Complete previous stops first" : "Start challenge"}
            </Text>
          </Pressable>
        </View>
      )}

      <View style={[styles.topBar, { top: insets.top + 12 }]}>
        {onHome ? (
          <Pressable onPress={onHome} accessibilityRole="button" accessibilityLabel="Go home">
            {({ pressed }) => (
              <View style={[styles.mapButton, pressed && styles.mapButtonPressed]}>
                <Text style={styles.mapButtonText}>🏠 Home</Text>
              </View>
            )}
          </Pressable>
        ) : <View />}

        <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
          <Pressable
            onPress={() => setShowAchievements(true)}
            accessibilityRole="button"
            accessibilityLabel="View achievements"
          >
            {({ pressed }) => (
              <View style={[styles.hud, pressed && styles.hudPressed]}>
                <Text style={styles.hudText}>🪶 {collection.feathers}</Text>
                <Text style={styles.hudDivider}>·</Text>
                <Text style={styles.hudText}>🥚 {collection.eggs}</Text>
                <Text style={styles.hudDivider}>·</Text>
                <Text style={styles.hudText}>🐦 {collection.discoveredBirdsCount}</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {onSignOut ? (
          <Pressable onPress={onSignOut} accessibilityRole="button" accessibilityLabel="Sign out">
            {({ pressed }) => (
              <View style={[styles.mapButton, pressed && styles.mapButtonPressed]}>
                <Text style={styles.mapButtonText}>Sign out ➡️</Text>
              </View>
            )}
          </Pressable>
        ) : <View />}
      </View>

      <AchievementsView
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
        collectionSummary={collection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  map: { flex: 1 },
  stopCard: { position: "absolute", bottom: 34, left: 16, right: 16, borderRadius: 18, backgroundColor: "#fff", borderWidth: 1, borderColor: "#d1dcc3", padding: 16, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  stopCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  stopCardTitles: { flex: 1 },
  dismissBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#f0f3eb", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  dismissBtnText: { color: "#607055", fontWeight: "700", fontSize: 13 },
  statusBadge: { marginTop: 8, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, backgroundColor: "#e6f0da" },
  badgeCompleted: { backgroundColor: "#d4edce" },
  badgeLocked: { backgroundColor: "#ebebeb" },
  statusBadgeText: { fontSize: 12, fontWeight: "700", color: "#3a5732" },
  stopTitle: { fontSize: 18, fontWeight: "800", color: "#1f2a16" },
  stopMeta: { marginTop: 3, color: "#5a6b51", fontSize: 13 },
  previewImage: { marginTop: 10, width: "100%", height: 300, borderRadius: 10, backgroundColor: "#d8e2ca" },
  launchButton: { marginTop: 12, borderRadius: 10, backgroundColor: "#2f5d2f", paddingVertical: 11, alignItems: "center" },
  launchButtonLocked: { backgroundColor: "#889481" },
  launchButtonPressed: { backgroundColor: "#1a3a1a", opacity: 0.8 },
  launchButtonText: { color: "#fff", fontWeight: "700" },
  topBar: { position: "absolute", left: 16, right: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", zIndex: 99, elevation: 10 },
  hud: { flexDirection: "row", gap: 8, backgroundColor: "rgba(255,255,255,0.92)", paddingVertical: 7, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1, borderColor: "#d3ddc7" },
  hudPressed: { backgroundColor: "rgba(255,255,255,1)", borderColor: "#2f5d2f" },
  hudText: { fontWeight: "700", color: "#2b3f22", fontSize: 13 },
  hudDivider: { color: "#9aaa8e", fontSize: 13 },
  mapButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.95)", borderWidth: 1.5, borderColor: "#2f5d2f", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  mapButtonPressed: { backgroundColor: "#e4f0e0", opacity: 0.9 },
  mapButtonText: { color: "#2f5d2f", fontWeight: "700", fontSize: 13 },
  placeholderContent: {
    width: "100%",
    height: "100%",
    borderRadius: 23,
    backgroundColor: "#2f5d2f",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 24,
    color: "#fff",
  },
});