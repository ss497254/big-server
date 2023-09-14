/**
 * Custom properties on the req object in express
 */

import { Accountability } from ".";

export {};

declare global {
  namespace Express {
    export interface Request {
      token: string | null;
      accountability?: Accountability;
      singleton?: boolean;
    }
  }

  type Override<T1, T2> = Omit<T1, keyof T2> & T2;
}
