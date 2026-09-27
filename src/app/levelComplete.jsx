import { reactiveModel } from "../mobxReactiveModel";
import LevelCompletePresenter from "../reactjs/levelCompletePresenter";

export default function LevelCompletePage() {
    return <LevelCompletePresenter model={reactiveModel} />;
}
