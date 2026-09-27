import { useState, useMemo, useEffect, useRef } from "react";
import { View, Text, Image, Pressable, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AchievementsView from "./achievementsView";

import { GoogleMap, Polyline, OverlayView, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const headers = {
  'User-Agent': 'Birdify/1.0',
  'Api-User-Agent': 'Birdify/1.0'
};

function CustomMarker({ waypoint, isStart, teeterValue }) {
  const animatedStyle = isStart && teeterValue ? {
    transform: [
      {
        rotate: teeterValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['-8deg', '8deg'],
        }),
      },
    ],
  } : {};

  if (waypoint.status === "completed" && waypoint.discoveredImage) {
    return (
      <View style={markerStyles.photoPin}>
        <Image source={{ uri: waypoint.discoveredImage, headers }} style={markerStyles.photoImage} />
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

const STATUS_LABEL = { completed: "✓ Discovered", current: "? Unlocked", locked: "🔒 Locked" };

const containerStyle = { width: '100%', height: '100%' };

export default function ContinentMapView({ continent, waypoints, collectionSummary, onSelectQuestion, onSignOut, onHome }) {
  const insets = useSafeAreaInsets();

  // Find the first unlocked-but-unanswered waypoint so we can focus the map on it.
  const activeWaypoint = useMemo(() => {
    if (!waypoints) return null;
    return waypoints.find(w => w.status === "current") ?? null;
  }, [waypoints]);

  const [selected, setSelected] = useState(activeWaypoint);
  const [showAchievements, setShowAchievements] = useState(false);
  const teeterValue = useRef(new Animated.Value(0)).current;

  useEffect(function startTeeterCB() {
    const teeterAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(teeterValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(teeterValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    );
    teeterAnimation.start();
    return () => teeterAnimation.stop();
  }, [teeterValue]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  // Center on the active waypoint if there is one, otherwise show the full continent.
  const center = useMemo(() => {
    if (activeWaypoint) {
      return { lat: activeWaypoint.lat, lng: activeWaypoint.lng };
    }
    if (!waypoints || waypoints.length === 0) return { lat: 0, lng: 0 };
    const lats = waypoints.map(w => w.lat);
    const lngs = waypoints.map(w => w.lng);
    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  }, [waypoints, activeWaypoint]);

  // Zoom in close on the active bird; zoom out to see the full continent when all done.
  const initialZoom = activeWaypoint ? 6 : 4;

  const routePath = useMemo(() => {
    if (!waypoints || waypoints.length === 0) return [];
    return [...waypoints]
      .sort((a, b) => a.gameQuestion - b.gameQuestion)
      .map(w => ({ lat: w.lat, lng: w.lng }));
  }, [waypoints]);

  if (!waypoints || waypoints.length === 0) return null;

  const collection = collectionSummary ?? { feathers: 0, eggs: 0, discoveredBirdsCount: 0 };

  if (!isLoaded) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={initialZoom}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
        }}
      >

        <Polyline
          path={routePath}
          options={{
            strokeColor: "#2f5d2f",
            strokeOpacity: 0.85,
            strokeWeight: 5,
            icons: [
              {
                icon: {
                  path: "M 0,-1 0,1",
                  strokeOpacity: 1,
                  scale: 3,
                },
                offset: "0",
                repeat: "15px",
              },
            ],
          }}
        />


        {waypoints.map((wp, index) => {
          // Find if this waypoint is the start of the optimized path
          const sortedWaypoints = [...waypoints];
          const distance = (p1, p2) => {
            const dx = p1.lat - p2.lat;
            const dy = p1.lng - p2.lng;
            return Math.sqrt(dx * dx + dy * dy);
          };
          const isStart = index === 0 && sortedWaypoints.length > 0 && wp.lat === sortedWaypoints[0].lat && wp.lng === sortedWaypoints[0].lng;

          return (
            <OverlayView
              key={String(wp.gameQuestion)}
              position={{ lat: wp.lat, lng: wp.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <Pressable
                onPress={() => setSelected(wp)}
                style={{ transform: [{ translateX: -21 }, { translateY: -42 }] }}
              >
                <CustomMarker waypoint={wp} isStart={isStart} teeterValue={teeterValue} />
              </Pressable>
            </OverlayView>
          );
        })}
      </GoogleMap>


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
            style={({ pressed, hovered }) => [styles.launchButton, selected.status === "locked" && styles.launchButtonLocked, selected.status !== "locked" && hovered && styles.launchButtonHovered, selected.status !== "locked" && pressed && styles.launchButtonPressed]}
            disabled={selected.status === "locked"}
            onPress={() => onSelectQuestion(selected.gameQuestion)}
          >
            <Text style={styles.launchButtonText}>
              {selected.status === "locked" ? "Complete previous stops first" : "Start challenge"}
            </Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={({ pressed, hovered }) => [
          styles.hud,
          { top: insets.top + 10 },
          (hovered || pressed) && styles.hudHovered,
        ]}
        onPress={() => setShowAchievements(true)}
        accessibilityRole="button"
        accessibilityLabel="View achievements"
      >
        <Text style={styles.hudText}>🪶 {collection.feathers}</Text>
        <Text style={styles.hudDivider}>·</Text>
        <Text style={styles.hudText}>🥚 {collection.eggs}</Text>
        <Text style={styles.hudDivider}>·</Text>
        <Text style={styles.hudText}>🐦 {collection.discoveredBirdsCount}</Text>
      </Pressable>

      <AchievementsView
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
        collectionSummary={collection}
      />

      {onHome && (
        <Pressable
          style={({ pressed, hovered }) => [
            styles.homeButton,
            { top: insets.top + 12 },
            hovered && styles.homeButtonHovered,
            pressed && styles.homeButtonPressed,
          ]}
          onPress={onHome}
        >
          <Text style={styles.homeButtonText}>🏠 Home</Text>
        </Pressable>
      )}

      {onSignOut && (
        <Pressable
          style={({ pressed, hovered }) => [
            styles.signOutButton,
            { top: insets.top + 12 },
            hovered && styles.signOutButtonHovered,
            pressed && styles.signOutButtonPressed,
          ]}
          onPress={onSignOut}
        >
          <Text style={styles.signOutButtonText}>➡️Sign out</Text>
        </Pressable>
      )}
    </View>
  );
}

const markerStyles = StyleSheet.create({
  pin: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 2.5, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4, elevation: 6 },
  pinCurrent: { backgroundColor: "#e67e22" },
  pinLocked: { backgroundColor: "#8b9589" },
  pinText: { fontSize: 16, fontWeight: "900", color: "#fff" },
  pinTail: { position: "absolute", bottom: -8, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 10, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#e67e22" },
  photoPin: { width: 46, height: 46, borderRadius: 23, borderWidth: 3, borderColor: "#2f5d2f", overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 6 },
  photoImage: { width: "100%", height: "100%" },
  birdMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff9e6",
    borderWidth: 2,
    borderColor: "#ffd700",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  birdEmoji: {
    fontSize: 28,
  },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
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
  previewImage: { marginTop: 10, width: "100%", height: 120, borderRadius: 10, backgroundColor: "#d8e2ca" },
  launchButton: { marginTop: 12, borderRadius: 10, backgroundColor: "#2f5d2f", paddingVertical: 11, alignItems: "center" },
  launchButtonLocked: { backgroundColor: "#889481" },
  launchButtonHovered: { backgroundColor: "#1f4620" },
  launchButtonPressed: { backgroundColor: "#1a3a1a", opacity: 0.8 },
  launchButtonText: { color: "#fff", fontWeight: "700" },
  hud: { position: "absolute", top: 14, alignSelf: "center", flexDirection: "row", gap: 8, backgroundColor: "rgba(255,255,255,0.6)", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 10 },
  hudHovered: { backgroundColor: "rgba(255,255,255,0.85)" },
  hudText: { fontWeight: "700", color: "#2b3f22", fontSize: 13 },
  hudDivider: { color: "#9aaa8e", fontSize: 13 },
  homeButton: { position: "absolute", left: 16, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#2f5d2f", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  homeButtonHovered: { backgroundColor: "#f0f7ee", borderColor: "#1f4620" },
  homeButtonPressed: { backgroundColor: "#e4f0e0", opacity: 0.9 },
  homeButtonText: { color: "#2f5d2f", fontWeight: "700", fontSize: 13 },
  signOutButton: { position: "absolute", right: 16, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#2f5d2f", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  signOutButtonHovered: { backgroundColor: "#f0f7ee", borderColor: "#1f4620" },
  signOutButtonPressed: { backgroundColor: "#e4f0e0", opacity: 0.9 },
  signOutButtonText: { color: "#2f5d2f", fontWeight: "700", fontSize: 13 },
});

