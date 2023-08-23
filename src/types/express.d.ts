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
}
