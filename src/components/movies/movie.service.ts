//acá van las validaciones de negocio, 
// que son las 2 que pide la consigna: puntaje de 1 a 10 
// y película no duplicada

import mongoose from "mongoose";
import { AppError } from "../../utils/AppError";
import { movieRepository, MovieInput } from "./movie.repository";

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
  getAll: () => movieRepository.findAll(),

  getById: async (id: string) => {
    checkId(id);
    const movie = await movieRepository.findById(id);
    if (!movie) throw new AppError(404, "Película no encontrada");
    return movie;
  },

  create: async (data: MovieInput) => {
    const { title, director, genre, rating } = data;
    if (!title || !director || !genre || rating === undefined) {
      throw new AppError(400, "Faltan campos: title, director, genre y rating son obligatorios");
    }
    checkRating(rating);

    const exists = await movieRepository.findByTitleAndDirector(title, director);
    if (exists) {
      throw new AppError(400, "Ya existe una película con ese título y director");
    }
    return movieRepository.create(data);
  },

  update: async (id: string, data: Partial<MovieInput>) => {
    checkId(id);
    if (data.rating !== undefined) checkRating(data.rating);

    const movie = await movieRepository.update(id, data);
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