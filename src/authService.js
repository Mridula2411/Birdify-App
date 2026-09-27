// authService.js
// Self-contained Firebase auth operations. Presenters call these functions
// instead of importing Firebase Auth directly.

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { auth } from "./firebaseConfig";

export function configureGoogleSignin() {
  GoogleSignin.configure({
    webClientId: "776544361660-ucjg02k8jn7le1jcb3lnodiofd2ukh98.apps.googleusercontent.com",
    offlineAccess: true,
  });
}

// Throws if credentials are wrong or email is unverified.
export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  if (!userCredential.user.emailVerified) {
    throw new Error("Please verify your email first.");
  }
  return userCredential.user;
}

// Throws with a code-friendly error if Google Sign-In fails.
export async function loginWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  if (!idToken) throw new Error("No ID Token found");
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
}

export { statusCodes };

// Creates the account, sets display name/avatar, and sends verification email.
export async function registerUser(name, email, password, avatarUrl) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, {
    displayName: name,
    photoURL: avatarUrl || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
  });
  await sendEmailVerification(userCredential.user);
  return userCredential.user;
}
