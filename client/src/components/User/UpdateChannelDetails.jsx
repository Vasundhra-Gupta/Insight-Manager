import { useState } from "react";
import useUserContext from "../../Context/UserContext";
import { Button } from "..";
import verifyExpression from "../../Utils/regex";
import { useNavigate } from "react-router-dom";
import { userService } from "../../Services/userService";

export default function UpdateChannelDetails() {
    const { user, setUser } = useUserContext();
    const initialInputs = {
        userName: user?.user_name,
        bio: user?.user_bio,
        password: "",
    };
    const nullErrors = {
        userName: "",
        bio: "", //100 characters
        password: "",
    };
    const [inputs, setInputs] = useState(initialInputs);
    const [error, setError] = useState(nullErrors);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    async function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    async function handleBlur(e) {
        const { name, value } = e.target;
        if (value && name !== "password") {
            verifyExpression(name, value, setError);
        }
    }

    async function onMouseOver() {
        if (
            Object.entries(inputs).some(([key, value]) => !value && key !== "bio") ||
            Object.entries(error).some(([key, value]) => value !== "" && key !== "password") ||
            !Object.entries(inputs).some(
                ([key, value]) => value !== initialInputs[key] && key !== "password"
            )
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
            const res = await userService.updateChannelDetails(inputs);
            if (res && !res.message) {
                setUser(res);
                setInputs((prev) => ({ ...prev, password: "" }));
            } else {
                setError((prev) => ({ ...prev, password: res.message }));
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setLoading(false);
            setDisabled(false);
        }
    }

    const inputFields = [
        {
            name: "userName",
            type: "text",
            placeholder: "Enter your user name",
            label: "Username",
            required: true,
        },
        {
            name: "password",
            type: "password",
            placeholder: "Enter your password",
            label: "Password",
            required: true,
        },
        {
            name: "bio",
            placeholder: "Add channel bio",
            label: "Bio",
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
            {field.name !== "bio" ? (
                <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={inputs[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={field.required}
                    className="bg-transparent border-[0.01rem]"
                />
            ) : (
                <textarea
                    name={field.name}
                    id={field.name}
                    value={inputs[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={field.required}
                    className="bg-transparent border-[0.01rem]"
                />
            )}
        </div>
    ));

    return (
        <div className="bg-slate-800">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">{inputElements}</div>
                <div className="flex gap-2">
                    <Button
                        btnText="Cancel"
                        onMouseOver={onMouseOver}
                        type="button"
                        disabled={loading}
                        onClick={() => {
                            setInputs(initialInputs);
                            setError(nullErrors);
                        }}
                    />
                    <Button
                        btnText={loading ? "Updating..." : "Update"}
                        type="submit"
                        disabled={disabled}
                        onMouseOver={onMouseOver}
                    />
                </div>
            </form>
        </div>
    );
}
