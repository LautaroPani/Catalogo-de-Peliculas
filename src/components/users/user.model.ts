// el password queda oculto por defecto en las consultas
import { Schema, model, Document } from "mongoose"; // Importamos los tipos de mongoose para 
// definir el esquema y el modelo

export interface IUser extends Document { //
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>( // Definimos el esquema de usuario
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);



export const User = model<IUser>("User", userSchema);