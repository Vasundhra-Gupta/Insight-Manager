import { useState } from "react";
import useUserContext from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../../Services/authService";
import { Button } from "..";

export default function Login({ className = "" }) {
    const [inputs, setInputs] = useState({
        loginInput: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState("");
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();

    function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function onMouseOver() {
        if (!inputs.loginInput || !inputs.password) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setError("");
        try {
            const res = await authService.login(inputs, setLoading);
            if (res && !res.message) {
                setUser(res);
                navigate("/");
            } else {
                setUser(null);
                setError(res.message);
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    const inputFields = [
        {
            type: "text",
            name: "loginInput",
            label: "Username or Email",
            value: inputs.loginInput,
            placeholder: "Enter username or email",
            required: true,
        },
        {
            type: "password",
            name: "password",
            label: "Password",
            value: inputs.password,
            placeholder: "Enter password",
            required: true,
        },
    ];

    const inputElements = inputFields.map((field) => (
        <div key={field.name}>
            <div>
                <label htmlFor={field.name}>
                    {field.required && <span className="text-red-500">* </span>}
                    {field.label} :
                </label>
            </div>
            <div>
                <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={inputs[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="bg-transparent border-[0.01rem]"
                />
            </div>
        </div>
    ));

    return (
        <div className={className}>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="">
                {inputElements}

                <div>
                    <Button
                        onMouseOver={onMouseOver}
                        btnText={loading ? "logging in ..." : "Login"}
                        disabled={disabled}
                    />
                </div>
            </form>
        </div>
    );
}
