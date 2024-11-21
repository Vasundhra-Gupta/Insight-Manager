-- before insert user
DELIMITER $$
CREATE TRIGGER before_insert_user
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE userExists BOOLEAN DEFAULT FALSE;

    SET userExists := EXISTS (SELECT 1 FROM users WHERE user_name = NEW.user_name OR user_email = NEW.user_email);

    IF userExists THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User with Username/Email already exists';
    ELSE 
        -- username
        IF NEW.user_name NOT REGEXP '^[A-Za-z0-9_]{1,20}$' THEN
           SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters, numbers and underscores are allowed and username can not exceed 20 characters';
        END IF;
        
        -- first name
        IF NEW.user_firstName NOT REGEXP '^[A-Za-z]{1,15}$' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters are allowed and first name can not exceed 15 characters';
        END IF;
          
          -- last name
        IF NEW.user_lastName NOT REGEXP '^[A-Za-z]{0,15}$' THEN -- bcz last name can be empty too!
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters are allowed and last name can not exceed 15 characters';
        END IF;

        -- bio
        IF LENGTH(NEW.user_bio) > 100 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bio Should not exceed 100 characters.';
        END IF;
        
        -- email
        IF NEW.user_email NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Please Enter a Valid Email';
        END IF;
    END IF;
END$$
DELIMITER ;

-- before update user
DELIMITER $$
CREATE TRIGGER before_update_users
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN   
	  -- user_name
    IF NEW.user_name NOT REGEXP '^[A-Za-z0-9_]{1,20}$' THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters, numbers and underscores are allowed and username can not exceed 20 characters';
    END IF;
    
    -- first name
    IF NEW.user_firstName NOT REGEXP '^[A-Za-z]{1,15}$' THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters are allowed and first name can not exceed 15 characters';
    END IF;
    
    -- last name
    IF NEW.user_lastName NOT REGEXP '^[A-Za-z]{0,15}$' THEN -- bcz last name can be empty too!
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only letters are allowed and last name can not exceed 15 characters';
    END IF;

    -- bio
    IF LENGTH(NEW.user_bio)>100 THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bio Should not exceed 100 characters.';
    END IF;
	
    -- email
    IF NEW.user_email NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$' THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Please Enter a Valid Email';
    END IF;
END$$
DELIMITER ;

-- before insert post
DELIMITER $$
CREATE TRIGGER before_insert_post
BEFORE INSERT ON posts
FOR EACH ROW
BEGIN
    IF LENGTH(NEW.post_title) > 100 THEN
		    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Post Title Should not exceed 100 characters.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER before_update_post
BEFORE UPDATE ON posts
FOR EACH ROW
BEGIN
    SET user_updatedAt = NOW();
		
    IF
END$$
DELIMITER ;

--- THIS IS NEW MODIFIED
CREATE OR REPLACE TRIGGER before_insert_update_user
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
DECLARE 
    userExists NUMBER(1) := 0;
BEGIN
        SELECT COUNT(*)
        INTO userExists
        FROM users 
        WHERE user_name = :NEW.user_name OR user_email = :NEW.user_email;
        
        IF userExists <> 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'User with Username/Email already exists');
        END IF;
    END IF;
     
     IF :NEW.user_id NOT LIKE '________-____-____-____-____________' THEN
        RAISE_APPLICATION_ERROR(-20002, 'Not a valid UUID');
    END IF;

    IF NOT REGEXP_LIKE(:NEW.user_name, '^[A-Za-z0-9_]{1,20}$') THEN
        RAISE_APPLICATION_ERROR(-20002, 'Only letters, numbers and underscores are allowed, and username cannot exceed 20 characters');
    END IF;
        
    IF NOT REGEXP_LIKE(:NEW.user_firstName, '^[A-Za-z]{1,15}$') THEN
        RAISE_APPLICATION_ERROR(-20003, 'Only letters are allowed and first name cannot exceed 15 characters');
    END IF;
      
    IF :NEW.user_lastName IS NOT NULL AND NOT REGEXP_LIKE(:NEW.user_lastName, '^[A-Za-z]{0,15}$') THEN 
       RAISE_APPLICATION_ERROR(-20004, 'Only letters are allowed and last name cannot exceed 15 characters');
    END IF;
END;

-- AIDIT TRIALS
CREATE TABLE users_audit(
    audit_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id VARCHAR(40) NOT NULL,
    change_time TIMESTAMP NOT NULL,
    description VARCHAR(255)
);
drop table users_audit;
-- users
CREATE OR REPLACE TRIGGER users_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO users_audit ( user_id, change_time, description ) 
	VALUES ( :NEW.user_id, CURRENT_TIMESTAMP, 'INSERT ON USERS TABLE');
    ELSIF DELETING THEN
        INSERT INTO users_audit ( user_id, change_time, description ) 
	VALUES ( :OLD.user_id, CURRENT_TIMESTAMP, 'DELETE ON USERS TABLE');
    ELSIF UPDATING THEN
        INSERT INTO users_audit ( user_id, change_time, description ) 
	VALUES ( :NEW.user_id, CURRENT_TIMESTAMP, 'UPDATE ON USERS TABLE');
    END IF;
END;

-- PACKAGES

CREATE OR REPLACE PACKAGE USERS_PACKAGE AS 
    FUNCTION getUser(
        searchInput IN VARCHAR2
    ) RETURN users%ROWTYPE;

    FUNCTION createUser(
        userId IN users.user_id%TYPE,
        userName IN users.user_name%TYPE,
        firstName IN users.user_firstName%type,
        lastName IN users.user_lastName%type,
        email IN users.user_email%type,
        avatar In users.user_avatar%type,
        coverImage In users.user_coverImage%type,
        password IN users.user_password%type
    ) RETURN VARCHAR2; 
    
    FUNCTION deleteUser(userId IN users.user_id%type) RETURN VARCHAR2;
    
    FUNCTION logoutUser(userId IN users.user_id%type) RETURN VARCHAR2;

    FUNCTION loginUser(
        userId IN users.user_id%type, 
        refreshToken IN users.refresh_token%type
    ) RETURN VARCHAR2;
    
    FUNCTION getChannelProfile(
        channelId IN users.user_id%type, 
        currentUserId IN users.user_id%type
    ) RETURN SYS_REFCURSOR;

    FUNCTION updateAccountDetails(
        userId IN users.user_id%type, 
        firstName IN users.user_firstName%type,
        lastName IN users.user_lastName%type,
        email IN users.user_email%type
    ) RETURN VARCHAR2;
END USERS_PACKAGE;
        
    FUNCTION updateChannelDetails(
        userId IN users.user_id%TYPE,
        userName IN users.user_name%TYPE,
        bio IN users.user_bio%type
    ) RETURN VARCHAR2;
            
    FUNCTION updatePassword(
        userId IN users.user_id%TYPE,
        password IN users.user_password%TYPE
    ) RETURN VARCHAR2;
    
    FUNCTION updateAvatar(
        userId IN users.user_id%TYPE,
        avatar IN users.user_avatar%TYPE
    ) RETURN VARCHAR2;
                
    FUNCTION updateCoverImage(
        userId IN users.user_id%TYPE,
        coverImage IN users.user_coverImage%TYPE
    ) RETURN VARCHAR2;

    FUNCTION getWatchHistory(
        userId IN users.user_id%type,
        orderBy IN VARCHAR2,
        limit IN NUMBER,
        page IN NUMBER
    ) RETURN SYS_REFCURSOR;
 
    FUNCTION clearWatchHistory(
        userId IN users.user_id%type
    ) RETURN VARCHAR2;
  
    FUNCTION updateWatchHistory(
        userId IN users.user_id%type,
        postId IN posts.post_id%type
    ) RETURN VARCHAR2;
END USERS_PACKAGE;




-- getuser

 FUNCTION getUser(searchInput VARCHAR2) RETURN users%ROWTYPE AS user_record users%ROWTYPE;
    BEGIN
        IF REGEXP_LIKE(searchInput, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
            SELECT * INTO user_record FROM users WHERE user_email = searchInput;
        ELSIF REGEXP_LIKE(searchInput, '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') THEN
            SELECT * INTO user_record FROM users WHERE user_id = searchInput;
        ELSE SELECT * INTO user_record FROM users WHERE user_name = searchInput;
        END IF;
        IF SQL%ROWCOUNT = 0 THEN DBMS_OUTPUT.PUT_LINE('USER NOT FOUND');
        END IF;
        RETURN user_record;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN RAISE_APPLICATION_ERROR(-20001, 'User not found : ' || SQLERRM);
        WHEN OTHERS THEN RAISE_APPLICATION_ERROR(-20001, 'Error retrieving user: ' || SQLERRM);
    END getUser;

-- getPoSTS

FUNCTION getPosts( channelId IN posts.post_ownerId%TYPE, limit NUMBER, orderBy VARCHAR2, page NUMBER, postCategory IN post_view.category_name%TYPE) RETURN SYS_REFCURSOR AS
        postCursor SYS_REFCURSOR;
        postOffset NUMBER;
        totalPosts NUMBER;
	BEGIN postOffset := (page-1)*limit;
        IF postCategory IS NOT NULL THEN  SELECT COUNT(*) INTO totalPosts FROM post_view p WHERE p.category_name = postCategory AND p.post_ownerId = channelId;
        ELSE SELECT COUNT(*) INTO totalPosts FROM post_view p WHERE p.post_ownerId = channelId;
        END IF;
        IF totalPosts = 0 THEN RAISE_APPLICATION_ERROR(-20004, 'No posts exists for the given user or given category.');
        END IF;
        OPEN postCursor FOR
            SELECT p.*, c.user_name AS userName, c.user_firstName AS firstName, c.user_lastName AS lastName, c.user_avatar AS avatar, c.user_coverImage AS coverImage , totalPosts
            FROM post_view p 
            JOIN channel_view c 
            ON p.post_ownerId = c.user_id
            WHERE p.post_ownerId = channelId AND (p.post_category = postCategory OR postCategory IS NULL)
            ORDER BY post_updatedAt DESC 
            OFFSET postOffset ROWS FETCH NEXT limit ROWS ONLY;
        RETURN postCursor;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20001, 'Error retrieving posts: ' || SQLERRM);
    END getPosts;


-- get posts declare

  DECLARE
        channelId posts.post_ownerId%TYPE := :channelId;
        limit NUMBER := :limit;
        orderBy VARCHAR2(5) := 'DESC';
        page NUMBER := :page;
        postCategory post_view.category_name%TYPE := :postCategory;

        CURSOR postCursor IS  SELECT p.*,
            c.user_name AS userName, c.user_firstName AS firstName,
            c.user_lastName AS lastName, c.user_avatar AS avatar,
            c.user_coverImage AS coverImage,
            totalPosts
            FROM post_view p
            JOIN channel_view c 
            ON p.post_ownerId = c.user_id
            WHERE (p.post_ownerId = channelId
            AND (p.category_name = LOWER(postCategory) 
            OR postCategory IS NULL));
            postRecord postCursor%ROWTYPE; 
            resultCursor SYS_REFCURSOR;
        BEGIN
            resultCursor := POSTS_PACKAGE.getPosts(
                channelId, limit, orderBy, page, LOWER(postCategory));
            LOOP
                FETCH resultCursor INTO postRecord;
                EXIT WHEN resultCursor%NOTFOUND;
                DBMS_OUTPUT.PUT_LINE('Post ID: ' || postRecord.post_id);
                DBMS_OUTPUT.PUT_LINE('channel ID: ' || postRecord.post_ownerId);
                DBMS_OUTPUT.PUT_LINE('Post Title: ' || postRecord.post_title);
                DBMS_OUTPUT.PUT_LINE('Post Title: ' || postRecord.post_content);
                DBMS_OUTPUT.PUT_LINE('Post Category: ' || postRecord.category_name);
                DBMS_OUTPUT.PUT_LINE('-------------------------');
            END LOOP;
            CLOSE resultCursor;
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END; 
