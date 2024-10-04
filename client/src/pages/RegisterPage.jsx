import { useState } from "react";
import { authService } from "../services/authService";
import useUserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        avatar: null,
        coverImage: null,
    });
    const nullErrors = {
        root: "",
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        avatar: "",
        coverImage: "",
    };
    const [error, setError] = useState(nullErrors);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();

    async function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    async function handleFileChange(e) {
        // because files are the last field (case when no further blur)
        const { name, files } = e.target;
        if (files[0]) {
            setInputs((prev) => ({ ...prev, [name]: files[0] }));
            const file = files[0];
            const extension = file.name.split(".").pop().toLowerCase();
            const fileSize = file.size / (1024 * 1024);
            const maxSizeMB = 100;
            const allowedExtensions = ["png", "jpg", "jpeg"];
            if (!allowedExtensions.includes(extension) || fileSize > maxSizeMB) {
                return setError((prevError) => ({
                    ...prevError,
                    [name]: "only PNG, JPG/JPEG files are allowed & File size should be less than 100MB.",
                }));
            }
            setError((prevError) => ({ ...prevError, [name]: "" }));
        } else {
            name === "avatar"
                ? setError((prevError) => ({ ...prevError, avatar: "avatar is required." }))
                : setError((prevError) => ({ ...prevError, coverImage: "" }));
        }
    }

    const handleBlur = (e) => {
        let { name, value, type, files } = e.target;

        if ((type === "text" || type === "password") && value) {
            if (name === "email") {
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: "" }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: "please enter a valid email.",
                      }));
            }

            if (name === "firstName" || name === "lastName") {
                /^[a-zA-Z]+$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: "" }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: "only letters are allowed.",
                      }));
            }

            if (name === "userName") {
                /^[a-zA-Z0-9_]+$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: "" }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: "only numbers, letters and underscores are allowed.",
                      }));
            }

            if (name === "password") {
                value.length >= 8 && value.length <= 12
                    ? setError((prevError) => ({ ...prevError, [name]: "" }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: "password must be 8-12 characters.",
                      }));
            }
        } else if (type === "file") {
            if (files[0]) {
                const file = files[0];
                const extension = file.name.split(".").pop().toLowerCase();
                const fileSize = file.size / (1024 * 1024);
                const maxSizeMB = 100;
                const allowedExtensions = ["png", "jpg", "jpeg"];
                if (!allowedExtensions.includes(extension) || fileSize > maxSizeMB) {
                    return setError((prevError) => ({
                        ...prevError,
                        [name]: "only PNG, JPG/JPEG files are allowed & File size should be less than 100MB.",
                    }));
                }
                setError((prevError) => ({ ...prevError, [name]: "" }));
            } else {
                name === "avatar"
                    ? setError((prevError) => ({ ...prevError, avatar: "avatar is required." }))
                    : setError((prevError) => ({ ...prevError, coverImage: "" }));
            }
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setError(nullErrors);
        if (Object.values(error).some((err) => err !== "")) {
            return; // The some() method returns true if at least one element satisfies the condition.
        }
        try {
            const res = await authService.register(inputs);
            if (res && !res.message) {
                setUser(res);
                navigate("/");
            } else if (res.message) {
                setError((prev) => ({ ...prev, root: res.message }));
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setDisabled(false);
            setError(nullErrors);
            setLoading(false);
        }
    }

    function onMouseOver() {
        if (
            Object.entries(inputs).some(
                ([key, value]) => !value && key !== "coverImage" && key !== "lastName"
            ) ||
            Object.values(error).some((err) => err !== "")
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    const inputFields = [
        {
            type: "text",
            name: "userName",
            label: "Username",
            value: inputs.userName,
            placeholder: "Enter user name",
            required: true,
        },
        {
            type: "text",
            name: "firstName",
            label: "FirstName",
            value: inputs.firstName,
            placeholder: "Enter first name",
            required: true,
        },
        {
            type: "text",
            name: "lastName",
            label: "LastName",
            value: inputs.lastName,
            placeholder: "Enter last name",
            required: false,
        },
        {
            type: "text",
            name: "email",
            label: "Email",
            value: inputs.email,
            placeholder: "Enter email",
            required: true,
        },
        {
            type: "password",
            name: "password",
            label: "Password",
            value: inputs.password,
            placeholder: "Create password",
            required: true,
        },
    ];

    const fileFields = [
        {
            name: "avatar",
            label: "Avatar",
            required: true,
        },
        {
            name: "coverImage",
            label: "CoverImage",
            required: false,
        },
    ];

    const inputElements = inputFields.map((field) => (
        <div key={field.name}>
            {error[field.name] && <div className="text-red-500">{error[field.name]}</div>}
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
                    onBlur={handleBlur}
                    placeholder={field.placeholder}
                    className="bg-transparent border-[0.01rem]"
                />
            </div>
        </div>
    ));

    const fileElements = fileFields.map((field) => (
        <div key={field.name}>
            {error[field.name] && <div className="text-red-500">{error[field.name]}</div>}
            <div>
                <label htmlFor={field.name}>
                    {field.required && <span className="text-red-500">* </span>}
                    {field.label} :
                </label>
            </div>
            <div>
                <input
                    type="file"
                    name={field.name}
                    id={field.name}
                    onChange={handleFileChange}
                    onBlur={handleBlur}
                    className="bg-transparent border-[0.01rem]"
                />
            </div>
        </div>
    ));

    return (
        <div className="bg-gray-800">
            {error.root && <div className="text-red-500">{error.root}</div>}
            <form onSubmit={handleSubmit}>
                {inputElements}

                {fileElements}

                <div>
                    <button
                        onMouseOver={onMouseOver}
                        disabled={disabled}
                        className="disabled:cursor-not-allowed bg-neutral-600"
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </div>
            </form>
        </div>
    );
}
