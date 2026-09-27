import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { statusCodes } from "../authService";
import LoginView from "../views/loginView";
import { Alert, Platform } from "react-native";

export const LoginPresenter = observer(function LoginPresenter(props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    props.model.configureGoogle();
  }, []);

  async function handleGoogleLogin() {
    try {
      await props.model.loginWithGoogle();
      router.replace("/continents");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      let msg = error.message;
      if (error.code === statusCodes.IN_PROGRESS) msg = "Sign in in progress";
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) msg = "Play services not available";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Error", msg);
    }
  }

  async function handleLogin() {
    if (!email || !password) return;
    try {
      await props.model.loginWithEmail(email, password);
      setEmail("");
      setPassword("");
      router.replace("/continents");
    } catch (error) {
      const msg = error.message.includes("verify") ? error.message : "Login Failed: " + error.message;
      const title = error.message.includes("verify") ? "Verification Required" : "Error";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert(title, msg);
    }
  }

  return (
    <LoginView
      onLogin={handleLogin}
      onSignUp={() => router.push("/signup")}
      onGoogleLogin={handleGoogleLogin}
      isGoogleReady={true}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
    />
  );
});

