import { FirebaseInstance } from "./setup";
import { getAuth } from "firebase-admin/auth";

export const auth = getAuth(FirebaseInstance);
