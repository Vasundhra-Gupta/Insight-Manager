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
    category_name varchar(10) NOT NULL UNIQUE
);
insert into categories
values ("1d171455-beec-4c44-bf8e-dd6d897c67c3", "art");