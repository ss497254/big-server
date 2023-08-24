import { FirebaseInstance } from "./setup";
import { getStorage } from "firebase-admin/storage";

export const storage = getStorage(FirebaseInstance);
