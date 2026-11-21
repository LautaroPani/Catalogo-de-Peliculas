import express from "express"; 

const app = express(); 

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON

app.get("/", (_req, res) => { // Ruta raíz para verificar que la API está funcionando
  res.status(200).json({ message: "API de catálogo de películas" });
});

import movieRoutes from "./components/movies/movie.routes"; // Importamos las rutas de películas
import userRoutes from "./components/users/user.routes";

app.use("/api/auth", userRoutes); // Montamos las rutas de usuarios en /api/auth
app.use("/api/movies", movieRoutes); // Montamos las rutas de películas en /api/movies

export default app; // Exportamos la aplicación para que pueda ser utilizada en otros archivos, como el archivo de servidor principal (server.ts)