//movie.repository.ts (acá va solo el acceso a datos, sin lógica):
import { Types } from "mongoose";
import { Movie } from "./movie.model";

export interface MovieInput {
  title: string;
  director: string;
  genre: string;
  rating: number;
}

export const movieRepository = {
  findAll: (filter: Record<string, unknown> = {}) =>
    Movie.find(filter).populate("createdBy", "name email"),
  findById: (id: string) =>
    Movie.findById(id).populate("createdBy", "name email"),
  findByTitleAndDirector: (title: string, director: string) =>
    Movie.findOne({ title, director }),
  create: (data: MovieInput & { createdBy: string }) =>
    Movie.create({ ...data, createdBy: new Types.ObjectId(data.createdBy) }),
  update: (id: string, data: Partial<MovieInput>) =>
    Movie.findByIdAndUpdate(id, data, { new: true }),
  delete: (id: string) => Movie.findByIdAndDelete(id),
};