import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "API de catálogo de películas" });
});

import movieRoutes from "./components/movies/movie.routes";

app.use("/api/movies", movieRoutes);

export default app;