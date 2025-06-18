import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an asynchronous Express route handler to catch errors and pass them to the next middleware.
 * This avoids the need for repetitive try-catch blocks in every async route handler.
 *
 * @param fn The asynchronous Express RequestHandler function.
 * @returns A new RequestHandler that handles promises and errors.
 */
const asyncHandler = (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => { // Explicitly define return type as Promise<void>
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
