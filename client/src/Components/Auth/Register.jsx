import { useState } from "react";
import { authService } from "../../Services/authService";
import useUserContext from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "..";
import verifyExpression from "../../Utils/regex";
import fileRestrictions from "../../Utils/fileRestrictions";

export default function Register() {
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

    /* Methods */

    async function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    async function handleFileChange(e) {
        // because files are the last field (case when no further blur)
        const { name, files } = e.target;
        if (files[0]) {
            setInputs((prev) => ({ ...prev, [name]: files[0] }));
            fileRestrictions(files[0], name, setError);
        } else {
            name === "avatar"
                ? setError((prevError) => ({ ...prevError, avatar: "avatar is required." }))
                : setError((prevError) => ({ ...prevError, coverImage: "" }));
        }
    }

    const handleBlur = (e) => {
        let { name, value } = e.target;
        if (value) {
            verifyExpression(name, value, setError);
        }
    };

    function onMouseOver() {
        if (
            Object.entries(inputs).some(
                ([key, value]) => !value && key !== "coverImage" && key !== "lastName"
            ) ||
            Object.entries(error).some(([key, value]) => value !== "" && key !== "root")
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setError(nullErrors);
        try {
            const res = await authService.register(inputs);
            if (res && !res.message) {
                setUser(res);
                navigate("/");
            } else {
                setError((prev) => ({ ...prev, root: res.message }));
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    /* creating the input fields */

    const inputFields = [
        {
            type: "text",
            name: "userName",
            label: "Username",
            placeholder: "Enter user name",
            required: true,
        },
        {
            type: "text",
            name: "firstName",
            label: "FirstName",
            placeholder: "Enter first name",
            required: true,
        },
        {
            type: "text",
            name: "lastName",
            label: "LastName",
            placeholder: "Enter last name",
            required: false,
        },
        {
            type: "text",
            name: "email",
            label: "Email",
            placeholder: "Enter email",
            required: true,
        },
        {
            type: "password",
            name: "password",
            label: "Password",
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
            <div className="flex gap-x-1">
                <label htmlFor={field.name}>
                    {field.required && <span className="text-red-500">* </span>}
                    {field.label} :
                </label>
                {error[field.name] && (
                    <div className="pt-[0.09rem] text-red-500 text-sm">{error[field.name]}</div>
                )}
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
            {field.name === "password" && (
                <div className="text-sm">password must be 8-12 characters.</div>
            )}
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
                    className="bg-transparent border-[0.01rem]"
                />
            </div>
        </div>
    ));

    return (
        <div className="bg-gray-800 w-full h-full">
            {error.root && <div className="text-red-500">{error.root}</div>}
            
            <form onSubmit={handleSubmit} className="w-full h-full">
                <div className="flex flex-col items-start justify-center gap-4">
                    {inputElements}
                    {fileElements}
                </div>

                <div>
                    <Button
                        disabled={disabled}
                        onMouseOver={onMouseOver}
                        btnText={loading ? "Signing Up..." : "Sign Up"}
                    />
                </div>
            </form>
        </div>
    );
}
