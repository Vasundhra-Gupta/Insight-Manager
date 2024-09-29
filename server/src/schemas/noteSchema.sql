CREATE TABLE notes (
    note_id varchar(40) PRIMARY KEY,
    user_id varchar(40),
    note_title varchar(100) NOT NULL,
    note_content text NOT NULL,
    note_createdAt timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT notes_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE completed_notes (
    note_id varchar(40),
    user_id varchar(40),
    CONSTRAINT completed_notes_pk PRIMARY KEY(user_id, note_id),
    CONSTRAINT completed_notes_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT completed_notes_note_id_fk FOREIGN KEY(note_id) REFERENCES notes(note_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE imp_notes (
    note_id varchar(40),
    user_id varchar(40),
    CONSTRAINT imp_notes_pk PRIMARY KEY(user_id, note_id),
    CONSTRAINT imp_notes_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT imp_notes_note_id_fk FOREIGN KEY(note_id) REFERENCES notes(note_id) ON DELETE CASCADE ON UPDATE CASCADE
);