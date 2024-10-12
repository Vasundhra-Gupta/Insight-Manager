import { Inotes } from "../interfaces/noteInterface.js";
import { connection } from "../server.js";

export class SQLnotes extends Inotes {
    // ⭐would use prepare/execute syntax of mysql dynamic query in future
    async getPublicNotes(userId, orderBy, limit) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error({ message: "INVALID_ORDERBY_VALUE" });
            }
            const q = `
                    SELECT * 
                    FROM public_notes_view 
                    WHERE user_id = ?
                    ORDER BY note_createdAt ${orderBy.toUpperCase()}
                    LIMIT ?
                `;
            const [response] = await connection.query(q, [userId, limit]);
            if (!response?.length) {
                return { message: `NO_PUBLIC_NOTES` };
            }
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getPrivateNotes(userId, orderBy, limit) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error({ message: "INVALID_ORDERBY_VALUE" });
            }
            const q = `
                    SELECT * 
                    FROM private_notes_view 
                    WHERE user_id = ?
                    ORDER BY note_createdAt ${orderBy.toUpperCase()}
                    LIMIT ?
                `;
            const [response] = await connection.query(q, [userId, limit]);
            if (!response?.length) {
                return { message: `NO_PRIVATE_NOTES` };
            }
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getNote(noteId, specifier) {
        try {
            let q = "SELECT * FROM notes WHERE note_id = ?";
            if (specifier === "PUBLIC") {
                q = "SELECT * FROM public_notes_view WHERE note_id = ?";
            } else {
                q = "SELECT * FROM private_notes_view WHERE note_id = ?";
            }
            const [[note]] = await connection.query(q, [noteId]);
            if (!note) {
                return { message: "NOTE_NOT_FOUND" };
            }
            return note;
        } catch (err) {
            throw err;
        }
    }

    async addNote(noteId, userId, title, content) {
        try {
            const q = "INSERT INTO notes (note_id, user_id, note_title, note_content) VALUES (?, ?, ?, ?)";
            await connection.query(q, [noteId, userId, title, content]);
            const note = await this.getNote(noteId);
            if (note?.message) {
                throw new Error("NOTE_CREATION_DB_ISSUE");
            }
            return note;
        } catch (err) {
            throw err;
        }
    }

    async deleteNote(noteId) {
        try {
            const q = "DELETE FROM notes WHERE note_id = ?";
            const [response] = await connection.query(q, [noteId]);

            if (response.affectedRows === 0) {
                throw new Error("NOTE_DELETION_DB_ISSUE");
            }
            return { message: "NOTE_DELETED_SUCCESSFULLY" };
        } catch (err) {
            throw err;
        }
    }

    async updateNote(noteId, title, content) {
        try {
            const q = "UPDATE notes SET note_title = ?, note_content = ? WHERE note_id = ?";
            await connection.query(q, [title, content, noteId]);
            const updatedNote = await this.getNote(noteId);
            if (updatedNote?.message) {
                throw new Error("NOTE_UPDATION_DB_ISSUE");
            }
            return updatedNote;
        } catch (err) {
            throw err;
        }
    }

    async toggleNoteVisibility(noteId, isPublic) {
        const q = "UPDATE notes SET is_public = ? WHERE note_id = ?";
        await connection.query(q, [isPublic, noteId]);

        const updatedNote = await this.getNote(noteId);
        if (updatedNote?.message) {
            throw new Error("NOTE_VISIBILITY_UPDATION_DB_ISSUE");
        }
        return updatedNote;
    }

    async toggleMarkImportant(isImp, noteId) {
        try {
            const q = `UPDATE notes SET is_imp = ? WHERE note_id = ?`;
            await connection.query(q, [isImp, noteId]);
            const response = await this.getNote(noteId);
            if (!response) {
                throw new Error({ message: "MARK_IMPORTANT_TOGGLING_DB_ISSUE" });
            }
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getImportantNotes(userId, orderBy, limit) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }
            const q = `
                SELECT *
                FROM  notes n
                WHERE n.user_id = ? AND is_imp = 1
                ORDER BY n.note_createdAt ${orderBy.toUpperCase()}
                LIMIT ?
            `;
            const [impNotes] = await connection.query(q, [userId, limit]);
            if (!impNotes.length) {
                return { message: "NO_IMP_NOTES" };
            }
            return impNotes;
        } catch (err) {
            throw err;
        }
    }

    async toggleMarkCompleted(isComplete, noteId) {
        try {
            const q = `UPDATE notes SET is_complete = ? WHERE note_id = ?`;
            await connection.query(q, [isComplete, noteId]);
            const response = await this.getNote(noteId);
            if (!response) {
                throw new Error({ message: "MARK_COMPLETE_TOGGLING_DB_ISSUE" });
            }
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getCompletedNotes(userId, orderBy, limit) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }
            const q = `
                SELECT *
                FROM notes n 
                WHERE n.user_id = ? AND is_complete = 1
                ORDER BY n.note_createdAt ${orderBy.toUpperCase()}
                LIMIT ?
            `;
            const [completedNotes] = await connection.query(q, [userId, limit]);
            if (!completedNotes.length) {
                return { message: "NO_NOTES_COMPLETED" };
            }
            return completedNotes;
        } catch (err) {
            throw err;
        }
    }
}
