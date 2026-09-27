import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginView({
  onLogin,
  onSignUp,
  onGoogleLogin,
  isGoogleReady,
  email, setEmail,
  password, setPassword
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Birdify</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={onSignUp}>
        <Text style={[styles.buttonText, styles.signUpText]}>Sign Up</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Google Login Button */}
      <TouchableOpacity
        style={[styles.button, styles.googleButton, !isGoogleReady && styles.disabledButton]}
        onPress={onGoogleLogin}
        disabled={!isGoogleReady}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#000"
  },
  button: {
    width: "100%",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2e7d32",
  },
  signUpText: {
    color: "#2e7d32",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%"
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc"
  },
  orText: {
    marginHorizontal: 10,
    color: "#666",
    fontWeight: "600"
  },
  googleButton: {
    backgroundColor: "#4285F4",
    marginBottom: 0
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  disabledButton: {
    opacity: 0.6
  }
});