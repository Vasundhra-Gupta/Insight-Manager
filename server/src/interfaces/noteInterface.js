export class Inotes {
    async getNotes(specifier, userId, orderBy, limit) {
        throw new Error("method getNotes is not overwritten.");
    }

    async getNote(noteId) {
        throw new Error("method getNote is not overwritten.");
    }

    async addNote(noteId, userId, title, content) {
        throw new Error("method addNote is not overwritten");
    }

    async deleteNote(noteId) {
        throw new Error("method deleteNote is not overwritten.");
    }

    async updateNote(noteId, title, content) {
        throw new Error("method updateNote is not overwritten.");
    }

    async toggleNoteVisibility(noteId, isPublic) {
        throw new Error("method toggleNoteVisibility is not overwritten.");
    }

    async toggleMarkImportant(isImp, noteId) {
        throw new Error("method toggleMarkImportant is not overwritten.");
    }

    async getImportantNotes(noteId, orderBy, limit) {
        throw new Error("method getImportantNotes is not overwritten.");
    }

    async toggleMarkCompleted(isComplete, noteId) {
        throw new Error("method toggleMarkComplete is not overwritten.");
    }
    async getCompletedNotes(noteId, orderBy, limit) {
        throw new Error("method getCompletedNotes is not overwritten.");
    }
}
