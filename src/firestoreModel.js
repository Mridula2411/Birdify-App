import { doc, getDoc, setDoc } from "firebase/firestore";
import { runInAction, toJS } from "mobx";
import { db } from "./firebaseConfig.js";

const COLLECTION = "birdifyGame";

export function connectToPersistence(model, watchFunction, uid) {
  runInAction(() => { model.ready = false; });

  const firestoreDoc = doc(db, COLLECTION, uid);

  const disposeReaction = watchFunction(
    () => [JSON.stringify(model.progress), JSON.stringify(model.collection)],
    () => {
      if (!model.ready) return;
      console.log("saving to firestore", model.progress, model.collection);
      setDoc(firestoreDoc, {
        progress: toJS(model.progress),
        collection: toJS(model.collection),
      }, { merge: true }).then(() => console.log("saved!")).catch(console.error);
    }
  );

  getDoc(firestoreDoc)
    .then(snapshot => {
      const data = snapshot.data();
      runInAction(() => {
        model.progress   = data?.progress   ?? {};
        model.collection = data?.collection ?? { feathers: 0, eggs: 0, discoveredBirds: {} };
        model.ready = true;
      });
    })
    .catch(console.error);

  return disposeReaction;
}
