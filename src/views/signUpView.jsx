import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function SignUpView({
  onSignUp, onGoToLogin,
  name, setName,
  avatarUrl, setAvatarUrl,
  email, setEmail,
  password, setPassword
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput style={styles.input} placeholder="Display Name" placeholderTextColor="#2a2a2a" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Avatar URL (Optional)" placeholderTextColor="#2a2a2a" value={avatarUrl} onChangeText={setAvatarUrl} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#2a2a2a" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#2a2a2a" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={onSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.linkButton]} onPress={onGoToLogin}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30 },
  input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, color: "#000" },
  button: { width: "100%", backgroundColor: "#2e7d32", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  linkButton: { backgroundColor: "transparent" },
  linkText: { color: "#2e7d32", fontSize: 16, fontWeight: "500" }
});