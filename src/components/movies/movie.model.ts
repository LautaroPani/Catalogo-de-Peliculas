import { Schema, model, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  director: string;
  genre: string;
  rating: number;
}

const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true },
    director: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Movie = model<IMovie>("Movie", movieSchema);