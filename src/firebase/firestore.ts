import { getFirestore } from "firebase-admin/firestore";
import { FirebaseInstance } from "./setup";

export const firestore = getFirestore(FirebaseInstance);
