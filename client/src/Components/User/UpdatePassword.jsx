import { useState } from "react";
import { verifyExpression } from "../../Utils";
import { useNavigate } from "react-router-dom";
import { userService } from "../../Services";
import { Button } from "..";

export default function UpdatePassword() {
    const initialInputs = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
    const nullErrors = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
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
        if (value && name === "newPassword") {
            verifyExpression(name, value, setError);
        }
    }

    async function onMouseOver() {
        if (Object.values(inputs).some((value) => !value)) {
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
            if (inputs.newPassword !== inputs.confirmPassword) {
                setError((prevError) => ({
                    ...prevError,
                    confirmPassword: "confirm password should match new password",
                }));
            } else if (inputs.oldPassword === inputs.newPassword) {
                setError((prevError) => ({
                    ...prevError,
                    newPassword: "new password should not match old password",
                }));
            } else {
                const res = await userService.updatePassword(
                    inputs.newPassword,
                    inputs.oldPassword
                );
                if (res && !res.message) {
                    setInputs(initialInputs);
                } else {
                    setError((prev) => ({ ...prev, oldPassword: res.message }));
                }
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
            name: "oldPassword",
            type: "password",
            placeholder: "Enter current Password",
            label: "Old Password",
            required: true,
        },
        {
            name: "newPassword",
            type: "password",
            placeholder: "Create new password",
            label: "New Password",
            required: true,
        },
        {
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm new password",
            label: "Confirm Password",
            required: true,
        },
    ];

    const inputElements = inputFields.map((field) => (
        <div key={field.name}>
            <div className="flex gap-x-1">
                <label htmlFor={field.name}>
                    {field.required && <span className="text-red-500">*</span>}
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
                value={inputs[field.name]}
                placeholder={field.placeholder}
                onChange={handleChange}
                onBlur={handleBlur}
                required={field.required}
                className="bg-transparent border-[0.01rem]"
            />
            {field.name === "newPassword" && (
                <div className="text-sm text-white">Password must be 8-12 characters.</div>
            )}
        </div>
    ));

    return (
        <div className="bg-slate-600">
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
