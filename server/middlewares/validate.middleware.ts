import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate(schema: z.ZodType<unknown>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (result && typeof result === "object" && "body" in result) {
        req.body = result.body;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        res.fail("Validation Error", { errors }, 400);
        return;
      }
      next(error);
    }
  };
}
