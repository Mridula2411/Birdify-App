import { useState } from "react";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { registerUser } from "../authService";
import SignUpView from "../views/signUpView";
import { Alert, Platform } from "react-native";

export const SignUpPresenter = observer(function SignUpPresenter(props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    if (!email || !password || !name) {
      const msg = "Please enter Name, Email, and Password.";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }
    try {
      await registerUser(name, email, password, avatarUrl);

      const successMsg = "Account created! Please verify your email before logging in.";
      Platform.OS === "web" ? window.alert(successMsg) : Alert.alert("Success", successMsg);

      setName("");
      setAvatarUrl("");
      setEmail("");
      setPassword("");

      router.replace("/");
    } catch (error) {
      Platform.OS === "web"
        ? window.alert("Sign Up Failed: " + error.message)
        : Alert.alert("Failed", error.message);
    }
  }

  return (
    <SignUpView
      onSignUp={handleSignUp}
      onGoToLogin={() => router.replace("/")}
      name={name} setName={setName}
      avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl}
      email={email} setEmail={setEmail}
      password={password} setPassword={setPassword}
    />
  );
});
