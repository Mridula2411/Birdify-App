import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import HomeView from "../views/homeView";

export const HomePresenter = observer(function HomePresenter(props) {
    const router = useRouter();

    function handleStartJourney() {
        router.push("/continents");
    }

    return <HomeView onStartJourney={handleStartJourney} />;
});