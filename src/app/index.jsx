import { observer } from "mobx-react-lite";
import { Redirect } from "expo-router";
import { LoginPresenter } from "../reactjs/loginPresenter";
import { reactiveModel } from "../mobxReactiveModel";

const IndexPage = observer(function IndexPage() {
  if (reactiveModel.ready && reactiveModel.currentUserId) {
    return <Redirect href="/continents" />;
  }
  return <LoginPresenter model={reactiveModel} />;
});

export default IndexPage;
