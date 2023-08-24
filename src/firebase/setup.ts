import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import logger from "src/lib/logger";
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
        "innov8"
      )
    );
  }

  FirebaseInstance = apps[0];
};

export const CheckFirebase = async () => {
  await getFirestore(FirebaseInstance).listCollections();

  logger.info("Firebase intialized successfullly.");
};
