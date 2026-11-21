//Todos con try/catch (como pide el requisito 9)

import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { movieService } from "./movie.service";

const handleError = (error: unknown, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: "Error interno del servidor" });
};

export const getMovies = async (_req: Request, res: Response) => {
  try {
    const movies = await movieService.getAll();
    res.status(200).json(movies);
  } catch (error) {
    handleError(error, res);
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError(400, "El id es obligatorio");
    }
    const movie = await movieService.getById(id);
    res.status(200).json(movie);
  } catch (error) {
    handleError(error, res);
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const movie = await movieService.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError(400, "El id es obligatorio");
    }
    const movie = await movieService.update(id, req.body);
    res.status(200).json(movie);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try { 
    const id = req.params.id;
        if (typeof id !== "string") {
            throw new AppError(400, "El id es obligatorio");
    }
    await movieService.delete(id);
    res.status(200).json({ message: "Película eliminada" });
    } catch (error) {
    handleError(error, res);
  }
};