import { reactiveModel } from "../mobxReactiveModel";
import MapPresenter from "../reactjs/mapPresenter";

export default function MapPage() {
    return <MapPresenter model={reactiveModel} />;
}
