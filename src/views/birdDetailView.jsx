// birdDetailView.jsx

import { View, Text, StyleSheet } from "react-native";

export default function BirdDetailView({ commonName, scientificName, country, wikiExtract }) {

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Bird Summary</Text>
      <Text style={styles.name}>{commonName}</Text>
      <Text style={styles.meta}>{scientificName}</Text>
      {!!country && <Text style={styles.meta}>Seen in: {country}</Text>}
      <Text style={styles.extract}>{wikiExtract || "No summary available yet."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9e0cd",
    backgroundColor: "#f7fbf0",
    padding: 14,
  },
  header: {
    fontSize: 13,
    fontWeight: "700",
    color: "#44603a",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2a16",
    marginTop: 12,
  },
  meta: {
    marginTop: 2,
    color: "#5f6b54",
    fontSize: 13,
  },
  extract: {
    marginTop: 10,
    color: "#2e3a25",
    lineHeight: 20,
    fontSize: 14,
  },
});
