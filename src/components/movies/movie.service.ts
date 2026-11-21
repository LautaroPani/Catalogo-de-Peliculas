//acá van las validaciones de negocio, 
// que son las 2 que pide la consigna: puntaje de 1 a 10 
// y película no duplicada

import mongoose from "mongoose";
import { AppError } from "../../utils/AppError";
import { movieRepository, MovieInput } from "./movie.repository";

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const checkId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, "El id no es válido");
  }
};

const checkRating = (rating: unknown) => {
  if (typeof rating !== "number" || rating < 1 || rating > 10) {
    throw new AppError(400, "El puntaje debe ser un número entre 1 y 10");
  }
};

export const movieService = {
  getAll: (query: Record<string, unknown>) => {
    const filter: Record<string, unknown> = {};

      if (typeof query.genre === "string") {
        filter.genre = new RegExp(`^${escapeRegex(query.genre)}$`, "i");
      }
      if (typeof query.director === "string") {
        filter.director = new RegExp(escapeRegex(query.director), "i");
      }
      if (typeof query.minRating === "string") {
        const min = Number(query.minRating);
        if (Number.isNaN(min)) {
          throw new AppError(400, "minRating debe ser un número");
        }
        filter.rating = { $gte: min };
      }
    return movieRepository.findAll(filter);
  },

  getById: async (id: string) => {
    checkId(id);
    const movie = await movieRepository.findById(id);
    if (!movie) throw new AppError(404, "Película no encontrada");
    return movie;
  },

  create: async (data: MovieInput, userId: string) => {
  const { title, director, genre, rating } = data;
  if (!title || !director || !genre || rating === undefined) {
    throw new AppError(400, "Faltan campos: title, director, genre y rating son obligatorios");
  }
  checkRating(rating);

  const exists = await movieRepository.findByTitleAndDirector(title, director);
  if (exists) {
    throw new AppError(400, "Ya existe una película con ese título y director");
  }
  return movieRepository.create({ title, director, genre, rating, createdBy: userId });
  },

  update: async (id: string, data: Partial<MovieInput>) => {
  checkId(id);
  if (data.rating !== undefined) checkRating(data.rating);

  const allowed = ["title", "director", "genre", "rating"];
  const updates = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowed.includes(key))
  );

  const movie = await movieRepository.update(id, updates);
  if (!movie) throw new AppError(404, "Película no encontrada");
  return movie;
  },

  delete: async (id: string) => {
    checkId(id);
    const movie = await movieRepository.delete(id);
    if (!movie) throw new AppError(404, "Película no encontrada");
    return movie;
  },
};