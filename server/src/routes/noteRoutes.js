import express from "express";
export const noteRouter = express.Router();
import { verifyJwt, optionalVerifyJwt } from "../middlewares/index.js";

import {
    getPrivateNotes,
    getPublicNotes,
    getNote,
    addNote,
    deleteNote,
    updateNote,
    toggleNoteVisibility,
    toggleMarkImportant,
    getImportantNotes,
    toggleMarkCompleted,
    getCompletedNotes,
} from "../controllers/noteController.js";

noteRouter.route("/public/:userId").get(getPublicNotes);

noteRouter.use(verifyJwt);

noteRouter.route("/private").get(getPrivateNotes);

noteRouter.route("/completed").get(getCompletedNotes);

noteRouter.route("/important").get(getImportantNotes);

noteRouter.route("/add").post(addNote);

noteRouter.route("/:noteId").patch(updateNote).get(getNote).delete(deleteNote);

noteRouter.route("/toggle-visibility/:noteId").patch(toggleNoteVisibility);

noteRouter.route("/toggle-imp/:noteId").patch(toggleMarkImportant);

noteRouter.route("/toggle-complete/:noteId").patch(toggleMarkCompleted);
