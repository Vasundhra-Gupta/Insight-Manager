import { useState } from "react";
import useUserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function LoginPage() {
    const [inputs, setInputs] = useState({
        loginInput: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();

    async function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        if (!inputs.loginInput || !inputs.password) {
            setError("both fields are compulsory");
            return;
        }
        const res = await authService.login(inputs);
        if (res && !res.message) {
            setUser(res);
            navigate("/");
        } else if (res.message === "WRONG_CREDENTIALS") {
            setUser(null);
            setError(res.message);
        }
        setLoading(false);
    }

    console.log(inputs);
    return (
        <div className="bg-gray-600">
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="">
                <div>
                    <div>
                        <label htmlFor="loginInput">username or email</label>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter your username or email"
                            id="loginInput"
                            name="loginInput"
                            value={inputs.loginInput}
                            onChange={handleChange}
                            className="text-white bg-transparent border-[0.01rem]"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="password">password</label>
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            id="password"
                            name="password"
                            value={inputs.password}
                            onChange={handleChange}
                            className="text-white bg-transparent border-[0.01rem]"
                        />
                    </div>
                </div>

                <div>
                    <button className="border-[0.01rem] bg-gray-300 text-black">Login</button>
                </div>
            </form>
        </div>
    );
}
