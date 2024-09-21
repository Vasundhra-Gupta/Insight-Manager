CREATE TABLE tasks (
    task_id varchar(40) PRIMARY KEY,
    user_id varchar(40),
    task_title varchar(100) NOT NULL,
    task_content text NOT NULL,
    task_createdAt timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT tasks_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE completed_tasks (
    task_id varchar(40),
	user_id varchar(40),
    CONSTRAINT completed_tasks_pk PRIMARY KEY(user_id,task_id),
    CONSTRAINT completed_tasks_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT completed_tasks_task_id_fk FOREIGN KEY(task_id) REFERENCES tasks(task_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE imp_tasks (
    task_id varchar(40),
	user_id varchar(40),
    CONSTRAINT imp_tasks_pk PRIMARY KEY(user_id,task_id),
    CONSTRAINT imp_tasks_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT imp_tasks_task_id_fk FOREIGN KEY(task_id) REFERENCES tasks(task_id) ON DELETE CASCADE ON UPDATE CASCADE
);