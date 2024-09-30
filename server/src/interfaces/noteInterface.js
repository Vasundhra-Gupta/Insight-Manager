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

    async toggleMarkImportant(userId, noteId){
        throw new Error("method toggleMarkImportant is not overwritten.");
    }

    async getImportantNotes(noteId, orderBy, limit) {
        throw new Error("method getImportantNotes is not overwritten.");
    }

    async toggleMarkComplete(userId, noteId){
        throw new Error("method toggleMarkComplete is not overwritten.");
    }
    async getCompletedNotes(noteId, orderBy, limit) {
        throw new Error("method getCompletedNotes is not overwritten.");
    }
}
