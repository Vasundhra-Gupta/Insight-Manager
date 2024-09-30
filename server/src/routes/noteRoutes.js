import express from "express";
export const noteRouter = express.Router();
import { verifyJwt } from "../middlewares/index.js";
import { getNotes, getNote, addNote, deleteNote, updateNote, toggleNoteVisibility } from "../controllers/noteController.js";

noteRouter.route("/user/:userId").get(getNotes).delete();
noteRouter.route("/note/:noteId").get(getNote).delete();

noteRouter.use(verifyJwt);
noteRouter.route("/add").post(addNote);
noteRouter.route("/delete/:noteId").delete(deleteNote)
noteRouter.route("/update/:noteId").patch(updateNote)
noteRouter.route("/toggle-visibility/:noteId").patch(toggleNoteVisibility)
