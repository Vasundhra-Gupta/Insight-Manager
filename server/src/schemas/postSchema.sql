CREATE TABLE posts (
    post_id varchar(40) PRIMARY KEY,
    post_image varchar(300) NOT NULL,
    post_title varchar(100) NOT NULL,
    post_content text NOT NULL,
    post_ownerId varchar(40),
    post_createdAt timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT posts_post_ownerId_fk FOREIGN KEY(post_ownerId) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE posts
ADD COLUMN post_isVisible boolean DEFAULT true NOT NULL;
ALTER TABLE posts
ADD COLUMN post_category varchar(40);
alter table posts
add constraint post_category_fk FOREIGN KEY(post_category) REFERENCES categories(category_id);
CREATE TABLE saved_posts(
    post_id varchar(40),
    user_id varchar(40),
    CONSTRAINT saved_posts_pk PRIMARY KEY(user_id, post_id),
    CONSTRAINT saved_posts_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT saved_posts_post_id_fk FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE categories(
    category_id varchar(40) PRIMARY KEY,
    category_name varchar(30) NOT NULL UNIQUE
);
insert into categories
values ("1d171455-beec-4c44-bf8e-dd6d897c67c3", "Art"),
("2de7524e-1556-44f8-a990-4dd3a12e046e", "Science"),
("a91bab52-160a-4086-9090-4aab1e6c1bee", "Sci-Fi"),
("7d5b8777-0527-49d5-bb92-afa779492e48", "Entertainment"),
("1b8b3130-5332-4706-98ed-cd94c4da719a", "Technical"),
("9893a2af-15d2-47a0-ac10-b01bb070a54b", "Others");
select * from categories;