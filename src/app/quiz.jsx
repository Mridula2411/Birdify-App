import { reactiveModel } from "../mobxReactiveModel";
import GamePresenter from "../reactjs/gamePresenter";

export default function QuizPage() {
    return <GamePresenter model={reactiveModel} />;
}
