import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import logger from "src/lib/logger";
import { bucket, firestore, setFirebaseEntities } from ".";
import { getEnvConfig } from "../config";

export let FirebaseInstance: App;

export const InitializeFirebase = async () => {
  const apps = getApps();

  if (apps.length === 0) {
    apps.push(
      initializeApp(
        {
          credential: cert({
            clientEmail: getEnvConfig("FIREBASE_CLIENT_EMAIL"),
            projectId: getEnvConfig("FIREBASE_PROJECT_ID"),
            privateKey: getEnvConfig("FIREBASE_PRIVATE_KEY")
              .split(String.raw`\n`)
              .join("\n"),
          }),
        },
        "BigServer"
      )
    );
  }

  FirebaseInstance = apps[0];
  setFirebaseEntities(FirebaseInstance);
};

export const CheckFirebase = async () => {
  await firestore.listCollections();
  await bucket.getFiles({ maxResults: 1 });

  logger.info("Firebase intialized successfullly.");
};
