import { Request, Response, NextFunction } from "express";

export const requireAdmin = (_req: Request, res: Response, next: NextFunction) => {
  if (res.locals.role !== "admin") {
    return res.status(403).json({ message: "Solo un administrador puede realizar esta acción" });
  }
  next();
};