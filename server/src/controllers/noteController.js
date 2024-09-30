import { v4 as uuid } from "uuid";
import validator from "validator";
import getServiceObject from "../db/serviceObjects";
import { OK, BAD_REQUEST, SERVER_ERROR } from "../constants/errorCodes";

export const noteObject = getServiceObject("notes");

const getNotes = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { orderBy = "desc", limit = 10 } = req.query;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OWNER_ID" });
        }

        const notes = await noteObject.getNotes(user_id, orderBy, limit);

        return res.status(OK).json(notes);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting all notes",
            error: err.message,
        });
    }
};

const getNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        const note = noteObject.getNote(noteId);

        return res.status(OK).json(note);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting note",
            error: err.message,
        });
    }
};

const addNote = async (req, res) => {
    try {
        const { user_id } = req.user;
        const noteId = uuid();
        const { title, content } = req.body;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OWNER_ID" });
        }

        if (!noteId) {
            return res.status(SERVER_ERROR).json({ message: "NOTEID_CREATION_UUID_ISSUE" });
        }

        if (!title || !content) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        const note = noteObject.addNote(noteId, user_id, title, content);

        return res.status(OK).json(note);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while creating notes",
            error: err.message,
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        const note = noteObject.getNote(noteId);

        if (!note) {
            return res.status(BAD_REQUEST).json(note);
        }

        if (note.user_id != user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER_OF_NOTE" });
        }

        await noteObject.deleteNote(noteId);

        return res.status(OK).json({ message: "DELETION SUCCESSFULL" });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while deleting notes",
            error: err.message,
        });
    }
};

const updateNote = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { noteId } = req.params;
        const { title, content } = req.body;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OWNER_ID" });
        }

        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        if (!title || !content) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        const note = noteObject.getNote(noteId);

        if (!note) {
            return res.status(BAD_REQUEST).json(note);
        }

        if (note.user_id != user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER_OF_NOTE" });
        }

        const [updatedNote] = await noteObject.updateNote(noteId, title, content);

        return res.status(OK).json(updatedNote);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while updating notes",
            error: err.message,
        });
    }
};

const toggleNoteVisibility = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { noteId } = req.params;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OWNER_ID" });
        }

        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        const note = noteObject.getNote(noteId);

        if (!note) {
            return res.status(BAD_REQUEST).json(note);
        }

        if (note.user_id != user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER_OF_NOTE" });
        }

        const updatedNote = await noteObject.toggleNoteVisibility(noteId, !note.note_visibility);
        return res.status(OK).json(updatedNote);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while toggling note visibility",
            error: err.message,
        });
    }
};

const toggleMarkImportant = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { noteId } = req.params;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OWNER_ID" });
        }

        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        const note = noteObject.getNote(noteId);

        if (!note) {
            return res.status(BAD_REQUEST).json({ message: "NOTES_NOT_FOUND" });
        }
        const response = await noteObject.toggleMarkImportant(user_id, noteId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while toggling important notes",
            error: err.message,
        });
    }
};

const getImportantNotes = async (req, res) => {
    try {
        const { user_id } = req.user;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OWNER_ID" });
        }

        const impNotes = await noteObject.getImportantNotes(user_id);
        return res.status(OK).json(impNotes);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting important notes",
            error: err.message,
        });
    }
};

const toggleMarkComplete = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { noteId } = req.params;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OWNER_ID" });
        }

        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        const note = noteObject.getNote(noteId);

        if (!note) {
            return res.status(BAD_REQUEST).json({ message: "NOTES_NOT_FOUND" });
        }

        const response = await noteObject.toggleMarkComplete(user_id, noteId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while toggling completed notes",
            error: err.message,
        });
    }
};

const getCompletedNotes = async (req, res) => {
    try {
        const { user_id } = req.user;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OWNER_ID" });
        }

        const completedNotes = await noteObject.getImportantNotes(user_id);
        return res.status(OK).json(completedNotes);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting comepleted notes",
            error: err.message,
        });
    }
};

export {
    getNotes,
    getNote,
    addNote,
    deleteNote,
    updateNote,
    toggleNoteVisibility,
    toggleMarkImportant,
    getImportantNotes,
    toggleMarkComplete,
    getCompletedNotes,
};
