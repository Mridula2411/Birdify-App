import { reactiveModel } from "../mobxReactiveModel";
import ContinentPresenter from "../reactjs/continentPresenter";

export default function ContinentsPage() {
    return <ContinentPresenter model={reactiveModel} />;
}
