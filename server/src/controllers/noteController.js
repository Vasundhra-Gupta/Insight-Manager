import { v4 as uuid } from "uuid";
import validator from "validator";
import getServiceObject from "../db/serviceObjects.js";
import { OK, BAD_REQUEST, SERVER_ERROR } from "../constants/errorCodes.js";

export const noteObject = getServiceObject("notes");

const getPrivateNotes = async (req, res) => {
    try {
        const { orderBy = "desc", limit = 10 } = req.query;
        const { user_id } = req.user;
        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USER_ID" });
        }

        const notes = await noteObject.getPrivateNotes(user_id, orderBy, limit);
        return res.status(OK).json(notes);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting private notes",
            error: err.message,
        });
    }
};

const getPublicNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        const { orderBy = "desc", limit = 10 } = req.query;

        if (!userId) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USER_ID" });
        }

        const notes = await noteObject.getPublicNotes(userId, orderBy, limit);
        return res.status(OK).json(notes);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting public notes",
            error: err.message,
        });
    }
};

const getNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { specifier } = req.query;
        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        const note = await noteObject.getNote(noteId, specifier);

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
            return res.status(BAD_REQUEST).json({ message: "MISSING_USER_ID" });
        }

        if (!noteId) {
            return res.status(SERVER_ERROR).json({ message: "NOTEID_CREATION_UUID_ISSUE" });
        }

        if (!title || !content) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        const note = await noteObject.addNote(noteId, user_id, title, content);

        return res.status(OK).json(note);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while creating note",
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

        const note = await noteObject.getNote(noteId);
        if (!note) {
            return res.status(BAD_REQUEST).json(note);
        }

        if (note.user_id != user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER" });
        }

        await noteObject.deleteNote(noteId);

        return res.status(OK).json({ message: "NOTE_DELETED_SUCCESSFULLY" });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while deleting note",
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
            return res.status(BAD_REQUEST).json({ message: "MISSING_USER_ID" });
        }

        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        if (!title || !content) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        const note = await noteObject.getNote(noteId);
        if (!note) {
            return res.status(BAD_REQUEST).json(note);
        }

        if (note.user_id !== user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER" });
        }

        const updatedNote = await noteObject.updateNote(noteId, title, content);

        return res.status(OK).json(updatedNote);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while updating note",
            error: err.message,
        });
    }
};

const toggleNoteVisibility = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { noteId } = req.params;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USER_ID" });
        }

        console.log(user_id, "   ", noteId);
        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        const note = await noteObject.getNote(noteId);
        console.log(note);
        if (!note) {
            return res.status(BAD_REQUEST).json(note);
        }
        console.log(note.user_id);
        if (note?.user_id !== user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER" });
        }

        const updatedNote = await noteObject.toggleNoteVisibility(noteId, !note?.is_public);
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

        const note = await noteObject.getNote(noteId);
        if (!note) {
            return res.status(BAD_REQUEST).json({ message: "NOTE_NOT_FOUND" });
        }
        console.log(note);
        if (note?.user_id !== user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER" });
        }

        const response = await noteObject.toggleMarkImportant(user_id, noteId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while toggling important note",
            error: err.message,
        });
    }
};

const getImportantNotes = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { orderBy = "desc", limit = 10 } = req.query;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USER_ID" });
        }

        const impNotes = await noteObject.getImportantNotes(user_id, orderBy, limit);
        return res.status(OK).json(impNotes);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting important notes",
            error: err.message,
        });
    }
};

const toggleMarkCompleted = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { noteId } = req.params;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USER_ID" });
        }

        if (!noteId || !validator.isUUID(noteId)) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_OR_INVALID_NOTEID" });
        }

        const note = noteObject.getNote(noteId);
        if (!note) {
            return res.status(BAD_REQUEST).json({ message: "NOTE_NOT_FOUND" });
        }

        if (note?.user_id !== user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER" });
        }

        const response = await noteObject.toggleMarkCompleted(user_id, noteId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while toggling complete note",
            error: err.message,
        });
    }
};

const getCompletedNotes = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { orderBy = "desc", limit = 10 } = req.query;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USER_ID" });
        }

        const completedNotes = await noteObject.getCompletedNotes(user_id, orderBy, limit);
        return res.status(OK).json(completedNotes);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting completed notes",
            error: err.message,
        });
    }
};

export {
    getPublicNotes,
    getPrivateNotes,
    getNote,
    addNote,
    deleteNote,
    updateNote,
    toggleNoteVisibility,
    toggleMarkImportant,
    getImportantNotes,
    toggleMarkCompleted,
    getCompletedNotes,
};
