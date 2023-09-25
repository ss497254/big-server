import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";
import { Storage, getStorage } from "firebase-admin/storage";
import { App } from "firebase-admin/app";
import { Bucket } from "@google-cloud/storage";
import { getEnvConfig } from "src/config";

export let firestore: Firestore;
export let auth: Auth;
export let storage: Storage;
export let bucket: Bucket;

export const setFirebaseEntities = (app: App) => {
  firestore = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  bucket = storage.bucket(getEnvConfig("FIREBASE_BUCKET_NAME"));
};
