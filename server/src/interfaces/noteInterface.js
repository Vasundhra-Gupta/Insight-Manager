export class Inotes {
    async getNotes(userId, orderBy, limit) {
        throw new Error("method getNotes is not overwritten.");
    }

    async getNote(noteId) {
        throw new Error("method getNote is not overwritten.");
    }

    async addNote(noteId, ownerId, title, content) {
        throw new Error("method addNote is not overwritten");
    }

    async deleteNote(noteId) {
        throw new Error("method deleteNote is not overwritten.");
    }

    async updateNote(noteId, title, content) {
        throw new Error("method updateNote is not overwritten.");
    }

    async toggleNoteVisibility(noteId, visibility) {
        throw new Error("method toggleNoteVisibility is not overwritten.");
    }

    async markImportant(noteId) {
        throw new Error("method markImportant is not overwritten.");
    }

    async markComplete(noteId) {
        throw new Error("method markComplete is not overwritten.");
    }
}
