import { useState } from "react";
import useUserContext from "../../Context/UserContext";
import Button from "../General/Button";
import verifyExpression from "../../Utils/regex";
import { useNavigate } from "react-router-dom";
import { userService } from "../../Services/userService";

export default function UpdatePassword() {
    const { user, setUser } = useUserContext();
    const initialInputs = {
        userPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
    const nullErrors = {
        userPassword: "",
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
        if (value && name !== "password" && name !== "cpassword") {
            verifyExpression(name, value, setError);
        }
        if (value && name === "cpassword") {
            if (inputs.confirmPassword != inputs.newPassword) {
                setError((prev) => ({
                    ...prev,
                    [name]: "Password doesn't match with new password.",
                }));
            }
        }
    }

    async function onMouseHover() {
        if (Object.entries(inputs).some(([key, value]) => !value)) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(nullErrors);
        try {
            const res = await userService.updatePassword(inputs.newPassword, inputs.userPassword);
            if (res.message === "PASSWORD_UPDATED_SUCCESSFULLY") {
                //password updated successfully(popup)
                // setInputs((prev) => ({ ...prev, password: "" }));
            } else if (res.message) {
                setError((prev) => ({ ...prev, password: res.message }));
            }
        } catch (err) {
            navigate("/server-error");
        } finally {
            setLoading(false);
        }
    }

    const inputFields = [
        {
            name: "userPassword",
            type: "password",
            placeholder: "Enter your current Password",
            label: "Old Password",
            required: true,
        },
        {
            name: "npassword",
            type: "password",
            placeholder: "Create new password",
            label: "New Password",
            required: true,
        },
        {
            name: "cpassword",
            type: "password",
            placeholder: "Confirm your password",
            label: "Confirm Password",
            required: true,
        },
    ];

    const inputElements = inputFields.map((field) => {
        <div key={field.name}>
            <div>
                <label htmlFor={field.name}>
                    {field.required && <span className="text-red-500">*</span>}
                    {field.label} :{field.name === "npassword" && <div className="text-sm text-white">Password must be 8-12 characters.</div>}
                </label>
                {error[field.name] && <div className="text-red-500 text-md">{error[field.name]}</div>}
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
            />
        </div>;
    });

    return (
        <div>
            {user ? (
                <form onSubmit={handleSubmit}>
                    <div>{inputElements}</div>
                    <Button
                        btnText="Cancel"
                        onMouseHover={onMouseHover}
                        type="button"
                        disabled={loading}
                        onclick={() => {
                            setInputs(initialInputs);
                            setError(nullErrors);
                        }}
                    />
                    <Button 
                      btnText= {loading ? "Updating" : "Update"} 
                      type="submit" 
                      disabled={disabled} 
                      onMouseHover={onMouseHover} 
                    />
                </form>
            ) : (
                <div>Please login to change password.</div>
            )}
        </div>
    );
}
