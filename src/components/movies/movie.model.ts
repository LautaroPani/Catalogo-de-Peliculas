import { Schema, model, Document, Types } from "mongoose";

export interface IMovie extends Document {
  title: string;
  director: string;
  genre: string;
  rating: number;
  createdBy: Types.ObjectId;
}

const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true },
    director: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Movie = model<IMovie>("Movie", movieSchema);