import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import LevelCompleteView from "../views/levelCompleteView";

const LevelCompletePresenter = observer(function LevelCompletePresenter(props) {
  const router = useRouter();

  const continent = props.model.selectedContinent;
  const questionNumber = props.model.selectedQuestion?.gameQuestion ?? 0;
  const canPlayNext = !props.model.isLastQuestionForContinent(continent, questionNumber);
  const collectionSummary = props.model.getCollectionSummary();
  const lastBird = props.model.lastDiscoveredBird;
  const perfectRun = props.model.lastLevelPerfectRun;

  function handleBackToMap() {
    router.push("/map");
  }

  function handlePlayNext() {
    const nextQ = questionNumber + 1;
    const unlocked = props.model.selectQuestion(nextQ);
    if (unlocked) {
      router.replace("/quiz");
    } else {
      router.push("/map");
    }
  }

  return (
    <LevelCompleteView
      continent={continent}
      questionNumber={questionNumber}
      collectionSummary={collectionSummary}
      lastDiscoveredBird={lastBird}
      perfectRun={perfectRun}
      canPlayNextLevel={canPlayNext}
      onBackToMap={handleBackToMap}
      onPlayNext={handlePlayNext}
    />
  );
});

export default LevelCompletePresenter;
