// Manejo de errores para la aplicación - Usaran los dos controladores

import { Response } from "express";
import { AppError } from "./AppError";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: "Error interno del servidor" });
};