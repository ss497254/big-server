import { NextFunction, Response } from "express";
import { InvalidPayloadError } from "src/errors";
import { AnyZodObject, ZodError } from "zod";

const validate =
  (schema: AnyZodObject) => (req: any, _res: Response, next: NextFunction) => {
    try {
      req = schema.parse(req);

      next();
    } catch (err) {
      let reason = "validation error";

      if (err instanceof ZodError) {
        reason = err.issues
          .map((z) => z.message || `${z.path.at(-1)} is ${z.code}`)
          .join(", ");
      }

      throw new InvalidPayloadError({ reason });
    }
  };

export default validate;
