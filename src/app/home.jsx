import { HomePresenter } from "../reactjs/homePresenter";
import { reactiveModel } from "../mobxReactiveModel";

export default function IndexPage() {
  return <HomePresenter model={reactiveModel} />;
}