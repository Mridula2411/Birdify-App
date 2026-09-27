import { useState } from "react";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { Alert, Platform } from "react-native";
import ContinentMapView from "../views/continentMapView";
import LoadingView from "../views/loadingView";

const MapPresenter = observer(function MapPresenter(props) {
  const router = useRouter();
  const continent = props.model.selectedContinent;
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSelectQuestion(gameQuestion) {
    const unlocked = props.model.selectQuestion(gameQuestion);
    if (unlocked) router.push({ pathname: "/quiz" });
  }

  function handleGoHome() {
    router.push("/continents");
  }

  function confirmSignOut(callback) {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to sign out?")) {
        callback();
      }
      return;
    }
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", onPress: callback, style: "destructive" },
      ],
      { cancelable: true }
    );
  }

  async function handleSignOut() {
    confirmSignOut(async () => {
      setIsSigningOut(true);
      try {
        await props.model.signOut();
        await new Promise((resolve) => setTimeout(resolve, 900));
      } catch (error) {
        console.error("Sign out failed:", error);
      } finally {
        router.replace("/");
      }
    });
  }

  if (isSigningOut) {
    return <LoadingView message="Thanks for playing — hope that was fun!" />;
  }

  return (
    <ContinentMapView
      continent={continent}
      waypoints={props.model.buildWaypoints(continent)}
      collectionSummary={props.model.getCollectionSummary()}
      onSelectQuestion={handleSelectQuestion}
      onHome={handleGoHome}
      onSignOut={handleSignOut}
    />
  );
});


export default MapPresenter;
