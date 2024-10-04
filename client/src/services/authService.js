class AuthService {
    async login(loginInput, password) {
        try {
            const res = await fetch("/api/v1/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    loginInput,
                    password,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in login service: ${err.message}`);
        }
    }

    async register(inputs) {
        try {
            const res = await fetch("/api/v1/users/register", {
                method: "POST",
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
            return console.error(`error in register service: ${err.message}`);
        }
    }

    async logout() {
        try {
            const res = await fetch("/api/v1/users/logout", {
                method: "PATCH",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            return console.error(`error in logout service: ${err.message}`);
        }
    }

    async deleteAccount() {
        try {
            const res = await fetch("/api/v1/users/delete", {
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
            return console.error(`error in deleteAccount service: ${err.message}`);
        }
    }

    async getCurrentUser() {
        try {
            const res = await fetch("/api/v1/users/current", {
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
            return console.error(`error in getCurrentUser service: ${err.message}`);
        }
    }

    async refreshAccessToken() {}
}

export const authService = new AuthService();
