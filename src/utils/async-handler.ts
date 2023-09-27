import type { Request, Response, NextFunction } from "express";

const asyncHandler =
  <T = any>(fn: T) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve((fn as any)(req, res, next)).catch(next);

export default asyncHandler;
