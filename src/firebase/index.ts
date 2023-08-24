import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";
import { Storage, getStorage } from "firebase-admin/storage";
import { App } from "firebase-admin/app";

export let firestore: Firestore;
export let auth: Auth;
export let storage: Storage;

export const setFirebaseEntities = (app: App) => {
  firestore = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
};
