CREATE TABLE users (
    user_id varchar(40) PRIMARY KEY,
    user_name varchar(20) NOT NULL UNIQUE,
    user_firstName varchar(15) NOT NULL,
    user_lastName varchar(15),
    user_avatar varchar(300) NOT NULL,
    user_coverImage varchar(300) NOT NULL,
    user_email varchar(100) NOT NULL UNIQUE,
    user_password varchar(70) NOT NULL,
    user_createdAt timestamp NOT NULL DEFAULT NOW()
);

ALTER TABLE users
ADD COLUMN user_bio varchar(100) DEFAULT '';
ALTER TABLE users 
ADD COLUMN refresh_token varchar(200) NOT NULL DEFAULT ''; 

CREATE TABLE watch_history (
    post_id varchar(40),
	user_id varchar(40),
    watchedAt timestamp DEFAULT NOW(),
    CONSTRAINT watch_history_pk PRIMARY KEY(user_id,post_id),
    CONSTRAINT watch_history_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT watch_history_note_id_fk FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);