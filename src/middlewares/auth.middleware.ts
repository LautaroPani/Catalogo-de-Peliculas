//middleware que verifique el JWT y protege las rutas que crean, modifican o eliminan películas

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    // El token tiene que venir como: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) { // Verificamos si el encabezado de autorización está presente y comienza con "Bearer "
      return res.status(401).json({ message: "Token no proporcionado" }); 
    }

    const token = authHeader.slice("Bearer ".length).trim(); // Eliminamos "Bearer " del inicio del token
    if (!token) { // Verificamos si el token está vacío después de eliminar "Bearer "
      return res.status(401).json({ message: "Token no proporcionado" }); // Si el token está vacío, devolvemos un error 401
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Falta la variable JWT_SECRET en el .env");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Guardamos el id del usuario para usarlo después en los controladores
    res.locals.userId = decoded.id;
    res.locals.role = decoded.role;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};