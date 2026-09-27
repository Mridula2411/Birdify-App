// resolvePromise.js
// Utility that tracks an async promise into a plain state object.

import { runInAction } from "mobx";

export function resolvePromise(promise, promiseState) {
    promiseState.promise = promise;
    promiseState.data    = null;
    promiseState.error   = null;

    promise
        .then(function saveDataACB(data) {
            if (promiseState.promise === promise) {
                runInAction(() => { promiseState.data = data; });
            }
        })
        .catch(function saveErrorACB(error) {
            if (promiseState.promise === promise) {
                runInAction(() => { promiseState.error = error.message ?? String(error); });
            }
        });
}


