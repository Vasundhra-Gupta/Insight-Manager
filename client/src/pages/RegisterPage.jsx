import { useState } from "react";
import { authService } from "../services/authService";
import useUserContext from "../context/UserContext";

export default function RegisterPage() {
    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        userEmail: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useUserContext();

    async function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => {
            return { ...prev, [name]: value };
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (!inputs.firstName || inputs.userName || inputs.userEmail || inputs.password) {
            setError("Please fill all the fields.");
        }
        const res = authService.register(inputs);
    }

    return (
        <div>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="firstName">First Name:</label>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={inputs.firstName}
                            onChange={handleChange}
                            placeholder="Enter your First name"
                            className="bg-transparent"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="lastName">Last Name:</label>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={inputs.lastName}
                            onChange={handleChange}
                            placeholder="Enter your Last name"
                            className="bg-transparent"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="userName">userName:</label>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="userName"
                            id="userName"
                            value={inputs.userName}
                            onChange={handleChange}
                            placeholder="Enter user name"
                            className="bg-transparent"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="userEmail">userEmail:</label>
                    </div>
                    <div>
                        <input
                            type="email"
                            name="userEmail"
                            id="userEmail"
                            value={inputs.userEmail}
                            onChange={handleChange}
                            placeholder="Enter your e-mail"
                            className="bg-transparent"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="password">Password:</label>
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={inputs.password}
                            onChange={handleChange}
                            placeholder="Create Password"
                            className="bg-transparent"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
