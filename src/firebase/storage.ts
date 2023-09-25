import {} from "firebase-admin/storage";
import { bucket } from ".";

export const addFile = async (
  path: string,
  data: any,
  contentType?: string
) => {
  await bucket.file(path).save(data, { public: true, contentType });

  return bucket.file(path).publicUrl();
};

export const getFile = async (path: string) => {
  return await bucket.file(path).get();
};
