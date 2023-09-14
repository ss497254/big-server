import { FieldPath, WhereFilterOp } from "firebase-admin/firestore";
import { firestore } from ".";

// Collection operations
export const getCollections = async () => {
  return (await firestore.listCollections()).map((doc) => doc.id);
};

export const getCollectionData = (collectionName: string) => {
  return firestore.collection(collectionName);
};

export const deleteCollection = (collectionName: string) => {
  return firestore.recursiveDelete(firestore.collection(collectionName));
};

// Item operations
export const addItem = async (collectionName: string, data: any) => {
  return await firestore.collection(collectionName).add(data);
};

export const deleteItem = async (collectionName: string, id: string) => {
  return await firestore.collection(collectionName).doc(id).delete();
};

export const getItems = async (
  collectionName: string,
  filter: FirebaseFirestore.Filter
) => {
  return (
    await firestore.collection(collectionName).where(filter).get()
  ).docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getItem = async (
  collectionName: string,
  fieldPath: string | FieldPath,
  opStr: WhereFilterOp,
  value: any
) => {
  return (
    await firestore
      .collection(collectionName)
      .where(fieldPath, opStr, value)
      .get()
  ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getItemById = (collectionName: string, docId: string) => {
  return firestore.collection(collectionName).doc(docId).get();
};

export const addItemWithId = async (
  collectionName: string,
  id: string,
  data: any
) => {
  return await firestore.collection(collectionName).doc(id).create(data);
};

export const updateItem = async (
  collectionName: string,
  id: string,
  data: any
) => {
  return await firestore.collection(collectionName).doc(id).update(data);
};

export const addOrUpdateItem = async (
  collectionName: string,
  id: string,
  data: any
) => {
  return await firestore
    .collection(collectionName)
    .doc(id)
    .set(data, { merge: true });
};
