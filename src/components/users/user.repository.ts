import { User } from "./user.model";

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

export const userRepository = {
  findByEmail: (email: string) => User.findOne({ email }),
  findByEmailWithPassword: (email: string) =>
    User.findOne({ email }).select("+password"),
  create: (data: UserInput) => User.create(data),
};