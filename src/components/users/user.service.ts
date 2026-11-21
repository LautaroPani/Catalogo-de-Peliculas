//aca van las validaciones del registro y la lógica de Bcrypt y JWT
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError";
import { userRepository } from "./user.repository";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userService = {
  register: async (data: { name?: string; email?: string; password?: string }) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new AppError(400, "Faltan campos: name, email y password son obligatorios");
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new AppError(400, "El email no tiene un formato válido");
    }
    if (password.length < 6) {
      throw new AppError(400, "La contraseña debe tener al menos 6 caracteres");
    }

    const exists = await userRepository.findByEmail(email.toLowerCase());
    if (exists) {
      throw new AppError(400, "Ya existe un usuario con ese email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashedPassword });

    // Nunca devolvemos el password
    return { id: user._id, name: user.name, email: user.email };
  },

  login: async (data: { email?: string; password?: string }) => {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError(400, "Faltan campos: email y password son obligatorios");
    }

    const user = await userRepository.findByEmailWithPassword(email.toLowerCase());
    // Mismo mensaje si falla el email o la contraseña, para no dar pistas
    if (!user) {
      throw new AppError(401, "Credenciales inválidas");
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      throw new AppError(401, "Credenciales inválidas");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Falta la variable JWT_SECRET en el .env");
    }

    // En el token va solo el id: nada de password ni datos sensibles
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });

    return { token, user: { id: user._id, name: user.name, email: user.email } };
  },
};