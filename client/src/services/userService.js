class UserService {
    async getChannelProfile(username) {
        try {
            const res = await fetch(`/api/v1/users/channel/${username}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in getChannelProfile service: ${err.message}`);
        }
    }

    async updateAccountDetails(inputs) {
        try {
            const res = await fetch("/api/v1/users/update-account", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in updateAccountDetails service: ${err.message}`);
        }
    }

    async updateChannelDetails(inputs) {
        try {
            const res = await fetch("/api/v1/users/update-channel", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in updateChannelDetails service: ${err.message}`);
        }
    }

    async updateAvatar(avatar) {
        try {
            const formData = new FormData();
            formData.append("avatar", avatar);

            const res = await fetch("/api/v1/users/update-avatar", {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in updateAvatar service: ${err.message}`);
        }
    }

    async updateCoverImage(coverImage) {
        try {
            const formData = new FormData();
            formData.append("coverImage", coverImage);

            const res = await fetch("/api/v1/users/update-coverImage", {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in updateCoverImage service: ${err.message}`);
        }
    }

    async updatePassword(newPassword, oldPassword) {
        try {
            const res = await fetch("/api/v1/users/update-password", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newPassword,
                    oldPassword,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in updatePassword service: ${err.message}`);
        }
    }

    async getWatchHistory(orderBy = "desc", limit = 10, page = 1) {
        try {
            const res = await fetch(`/api/v1/users/history?orderBy=${orderBy}&limit=${limit}&page=${page}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in getWatchHistory service: ${err.message}`);
        }
    }

    async clearWatchHistory() {
        try {
            const res = await fetch("/api/v1/users/history", {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in clearWatchHistory service: ${err.message}`);
        }
    }
}

export const userService = new UserService();
