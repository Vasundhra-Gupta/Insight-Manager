# images

<img src="sunflower.jpg" alt="first" width="200"/>
<p>this is the logo of the web app</p>

```
import mysql from "mysql2" // for code insertion in .md files
```

hello

```
 async getChannelProfile(userId) {
        try {
            // const q1 = "SELECT count(follower_id) as followersCount FROM users u join followers f where u.user_id = ? and f.following_id = u.user_id";
            // const q2 = "SELECT count(following_id) as followingCount FROM users u join followers f where u.user_id = ? and f.follower_id = u.user_id";
            // const [[{ followersCount }]] = await connection.query(q1, [userId]);
            // const [[{ followingCount }]] = await connection.query(q2, [userId]);
            const q =
                "SELECT  u.user_id AS user_id,u.user_name,user_firstName, user_lastName,u.user_coverImage,u.user_avatar,(SELECT COUNT(p.post_id) FROM posts p where p.post_ownerId = u.user_id) as total_posts, (SELECT COUNT(f.follower_id) FROM followers f WHERE f.following_id = u.user_id) AS total_followers, (SELECT COUNT(f2.following_id) FROM followers f2 WHERE f2.follower_id = u.user_id) AS total_following FROM users u WHERE u.user_id = ?";
            const [[response]] = await connection.query(q, [userId]);
            return response;
        } catch (err) {
            throw new Error(err);
        }
    }
```
