// mobxReactiveModel.js
// Makes the plain POJO model fully observable using MobX.
// All properties become observable, all methods become actions automatically.
// Import { model } from here in every presenter — never from gameModel.js directly.

import { observable, configure, reaction, runInAction } from "mobx";
import { onAuthStateChanged } from "firebase/auth";
import { model } from "./gameModel";
import { connectToPersistence } from "./firestoreModel";
import { auth } from "./firebaseConfig";
configure({ enforceActions: "always" });

export const reactiveModel = observable(model);

let disposeCurrentReaction = null;

onAuthStateChanged(auth, (user) => {
  if (disposeCurrentReaction) {
    disposeCurrentReaction();
    disposeCurrentReaction = null;
  }

  if (user) {
    console.log("connecting to persistence for user", user.uid);
    runInAction(() => {
      reactiveModel.currentUserId = user.uid;
      reactiveModel.progress = {};
      reactiveModel.collection = { feathers: 0, eggs: 0, discoveredBirds: {} };
      reactiveModel.selectedContinent = null;
      reactiveModel.selectedQuestion = null;
      reactiveModel.currentQuestionIndex = 0;
      reactiveModel.ready = false;
    });
    disposeCurrentReaction = connectToPersistence(reactiveModel, reaction, user.uid);
  } else {
    runInAction(() => {
      reactiveModel.currentUserId = null;
      reactiveModel.ready = true;
    });
  }
});


