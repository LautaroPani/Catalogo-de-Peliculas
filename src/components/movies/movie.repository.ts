//movie.repository.ts (acá va solo el acceso a datos, sin lógica):
import { Movie } from "./movie.model";

export interface MovieInput {
  title: string;
  director: string;
  genre: string;
  rating: number;
}

export const movieRepository = {
  findAll: () => Movie.find(),
  findById: (id: string) => Movie.findById(id),
  findByTitleAndDirector: (title: string, director: string) =>
    Movie.findOne({ title, director }),
  create: (data: MovieInput) => Movie.create(data),
  update: (id: string, data: Partial<MovieInput>) =>
    Movie.findByIdAndUpdate(id, data, { new: true }),
  delete: (id: string) => Movie.findByIdAndDelete(id),
};