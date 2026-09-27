import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { Alert, Platform } from "react-native";
import { getContinentNames } from "../birdsLevels";
import ContinentSelectView from "../views/continentSelectView";

const ContinentPresenter = observer(function ContinentPresenter(props) {
  const router = useRouter();
  const user = props.model.getUser();

  function handleSelectContinent(continent) {
    props.model.setSelectedContinent(continent);
    router.push("/map");
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
      try {
        await props.model.signOut();
      } catch (error) {
        console.error("Sign out failed:", error);
      } finally {
        router.replace("/");
      }
    });
  }

  return (
    <ContinentSelectView
      continents={getContinentNames()}
      levelsCompleted={(c) => props.model.getQuestionsCompleted(c)}
      onSelectContinent={handleSelectContinent}
      onSignOut={handleSignOut}
      user={user}
    />
  );
});

export default ContinentPresenter;
