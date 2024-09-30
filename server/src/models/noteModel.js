import { Inotes } from "../interfaces/noteInterface.js";
import { connection } from "../server.js";

export class SQLnotes extends Inotes {
    async getNotes(userId, orderBy, limit) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }
            const q = `
                SELECT * FROM notes 
                WHERE user_id = ?
                ORDER BY note_createdAt ${orderBy.toUpperCase()}
                LIMIT ?
                `;
            
            const [notes] = await connection.query(q, [userId, limit]);
            if (!notes) {
                return { message: "NOTES_NOT_FOUND" };
            }
            let is_imp =0;
            let is_completed= 0;

        if(userId){
            const q1= `(SELECT COUNT(note_id) FROM imp_notes WHERE user_id = ?) AS is_imp`
            const [[response1]] = await connection.query(q1, [userId]);
            if(response1.is_imp){
                is_imp=1;
            }
            const q2= `(SELECT COUNT(note_id) FROM completed_notes WHERE user_id = ?) AS is_completed`
            const [[response2]] = await connection.query(q2, [userId]);
            if(response2.is_completed){
                is_completed=1;
            }
        }
            return {...notes, is_imp, is_completed};
        } catch (err) {
            throw new Error(err);
        }
    }

    async getNote(noteId) {
        try {
            const q = "SELECT * FROM notes WHERE note_id = ?";
            const [[note]] = await connection.query(q, [noteId]);
            if (!note) {
                return { message: "NOTES_NOT_FOUND" };
            }
            return note;
        } catch (err) {
            throw new Error(err);
        }
    }

    async addNote(noteId, ownerId, title, content) {
        try {
            const q = "INSERT INTO notes (note_id, user_id, note_title, note_content) VALUES (?, ?, ?, ?)";
            await connection.query(q, [noteId, ownerId, title, content]);
            const note = await this.getNote(noteId);
            if (note?.message) {
                throw new Error("NOTES_CREATION_DB_ISSUE");
            }
            return note;
        } catch (err) {
            throw new Error(err);
        }
    }

    async deleteNote(noteId) {
        try {
            const q = "DELETE FROM notes WHERE note_id = ?";
            const [response] = await connection.query(q, [noteId]);

            if (response.affectedRows === 0) {
                throw new Error("NOTES_DELETION_DB_ISSUE");
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateNote(noteId, title, content) {
        try {
            const q = `
                UPDATE notes SET note_title = ? , note_content = ?
                WHERE note_id = ?
            `;
            await connection.query(q, [title, content, noteId]);
            const updatedNote = await this.getNote(noteId);
            if (updatedNote?.message) {
                throw new Error("NOTES_UPDATION_DB_ISSUE");
            }
            return updatedNote;
        } catch (err) {
            throw new Error(err);
        }
    }

    // pulic/ private
    async toggleNoteVisibility(noteId, visibility) {
        const q = `
                UPDATE notes SET note_visibility= ? 
                WHERE note_id = ?
            `;
        await connection.query(q, [visibility, noteId]);

        const updatedNote = await this.getNote(noteId);
        if (updatedNote?.message) {
            throw new Error("NOTE_VISIBILITY_UPDATION_DB_ISSUE");
        }
        return updatedNote;
    }

    async toggleMarkImportant(userId, noteId) {
        try{
            const q= "CALL toggleMarkImportant( ?, ?)";
            const [[[response]]] = await connection.query(q, [userId, noteId])
            return response;
        }catch(err){
            throw new Error(err)
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
                FROM imp_notes i
                JOIN notes n
                WHERE i.note_id = n.note_id AND i.user_id = ?
                ORDER BY n.note_createdAt ${orderBy}
                LIMIT ?
            `;
            const [impNotes] = await connection.query(q, [userId, limit]);
            if (!impNotes) {
                return { message: "IMPNOTES_NOT_FOUND" };
            }
            return impNotes;
        } catch (err) {
            throw new Error(err);
        }
    }

    async toggleMarkCompleted(userId, noteId) {
        try{
            const q= "CALL toggleMarkCompleted( ?, ?)";
            const [[[response]]] = await connection.query(q, [userId, noteId])
            return response;
        }catch(err){
            throw new Error(err)
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
                FROM completed_notes c
                JOIN notes n
                WHERE c.note_id = n.note_id AND c.user_id = ?
                ORDER BY n.note_createdAt ${orderBy}
                LIMIT ?
            `;
            const [completedNotes] = await connection.query(q, [userId, limit]);
            if (!completedNotes) {
                return { message: "COMPLETEDNOTES_NOT_FOUND" };
            }
            return completedNotes;
        } catch (err) {
            throw new Error(err);
        }
    }
}
