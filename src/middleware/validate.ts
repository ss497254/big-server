import { Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { InvalidPayloadError } from "src/errors";

const validate =
  (schema: AnyZodObject, cb: (x: any, res: Response) => void) =>
  (req: Request, res: Response) => {
    try {
      const data = schema.parse(req);
      cb(data, res);
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
