import express from "express";
import {
  getUsers,
  getUser,
  deleteUsers,
  deleteUser,
  createUser,
  editUser,
} from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.route("/").get(getUsers).delete(deleteUsers).post(createUser);
userRouter.route("/solo/:id").get(getUser).delete(deleteUser).patch(editUser);
