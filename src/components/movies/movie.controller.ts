//Todos con try/catch (como pide el requisito 9)

import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { movieService } from "./movie.service";
import { handleError } from "../../utils/handleError";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await movieService.getAll(req.query);
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
    const movie = await movieService.create(req.body, res.locals.userId); //
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