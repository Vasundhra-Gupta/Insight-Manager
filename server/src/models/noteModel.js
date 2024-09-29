import { Inotes } from "../interfaces/noteInterface.js";
import { connection } from "../server.js";

export class SQLnotes extends Inotes {
    async getNotes(userId, orderBy, limit) {}

    async getNote(noteId) {}

    async addNote(noteId, ownerId, title, content) {}

    async deleteNote(noteId) {}

    async updateNote(noteId, title, content) {}

    async toggleNoteVisibility(noteId, visibility) {}

    async markImportant(noteId) {}

    async markComplete(noteId) {}
}
