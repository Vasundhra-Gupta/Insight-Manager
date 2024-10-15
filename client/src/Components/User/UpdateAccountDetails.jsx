import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context";
import { verifyExpression } from "../../Utils";
import { userService } from "../../Services";
import { Button } from "..";

export default function UpdateAccountDetails() {
    const { user, setUser } = useUserContext();
    const initialInputs = {
        firstName: user?.user_firstName,
        lastName: user?.user_lastName,
        email: user?.user_email,
        password: "",
    };
    const nullErrors = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    };
    const [inputs, setInputs] = useState(initialInputs);
    const [error, setError] = useState(nullErrors);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        if (value && name !== "password") {
            // we don't want to show error on password
            verifyExpression(name, value, setError);
        }
    }

    function onMouseOver() {
        if (
            Object.entries(inputs).some(([key, value]) => !value && key !== "lastName") ||
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
            const res = await userService.updateAccountDetails(inputs);
            if (res && !res.message) {
                setUser(res);
                setInputs((prev) => ({ ...prev, password: "" }));
            } else {
                setError((prev) => ({ ...prev, password: res.message }));
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
            name: "email",
            type: "text",
            placeholder: "Enter your email",
            label: "Email",
            required: true,
        },
        {
            name: "firstName",
            type: "text",
            placeholder: "Enter your first name",
            label: "First name",
            required: true,
        },
        {
            name: "lastName",
            type: "text",
            placeholder: "Enter your last name",
            label: "Last name",
            required: false,
        },
        {
            name: "password",
            type: "password",
            placeholder: "Enter your password",
            label: "Password",
            required: true,
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
            <input
                type={field.type}
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                value={inputs[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                required={field.required}
                className="bg-transparent border-[0.01rem]"
            />
        </div>
    ));

    return (
        <div className="bg-slate-600">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">{inputElements}</div>
                <div className="flex gap-2">
                    <Button
                        btnText={loading ? "Updating..." : "Update"}
                        disabled={disabled}
                        type="submit"
                        onMouseOver={onMouseOver}
                    />
                    <Button
                        onMouseOver={onMouseOver}
                        btnText="Cancel"
                        type="button"
                        onClick={() => {
                            setInputs(initialInputs);
                            setError(nullErrors);
                        }}
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
