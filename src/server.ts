import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

start();