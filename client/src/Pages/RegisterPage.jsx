import { useState } from "react";
import { authService } from "../Services";
import { useUserContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { Button } from "../Components";
import { verifyExpression, fileRestrictions } from "../Utils";

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

    const [error, setError] = useState({
        root: "",
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        avatar: "",
        coverImage: "",
    });
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    async function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    async function handleFileChange(e) {
        const { name, files } = e.target;
        if (files && files[0]) {
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
                    className="bg-transparent border-[0.01rem] w-[300px]"
                />
            </div>
            {field.name === "password" && (
                <div className="text-xs">password must be 8-12 characters.</div>
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
                    className="bg-transparent border-[0.01rem] w-[300px]"
                />
            </div>
        </div>
    ));

    return (
        <div className="bg-gray-900 w-full h-full overflow-scroll flex items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center gap-4">
                <div>Create new account</div>

                {error.root && (
                    <div className="text-red-500 w-full text-center mb-4">{error.root}</div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-start justify-center gap-4"
                >
                    {inputElements}

                    {fileElements}

                    <div className="w-full">
                        <Button
                            className="w-full"
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                            btnText={loading ? "Signing Up..." : "Sign Up"}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
