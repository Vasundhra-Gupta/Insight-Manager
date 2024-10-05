import { useState } from "react";
import useUserContext from "../../Context/UserContext";
import Button from "../General/Button";
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
        password: "",
        bio: "", //100 characters
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

    async function onMouseHover() {
        //not from e??
        if (
            Object.entries(inputs).some(([key, value]) => !value && key !== "bio") ||
            // Object.entries(inputs).some(([key, value])=> )
            !Object.entries(inputs).some(([key, value]) => value !== initialInputs && key !== "password")
        ) {
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
            const res = await userService.updateChannelDetails(inputs);
            if (res && !res.message) {
                setUser(res);
                setInputs((prev) => ({ ...prev, password: "" }));
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
            name: "userName",
            type: "text",
            placeholder: "Enter your userName",
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
            type: "text",
            placeholder: "Add bio",
            label: "Bio",
            required: false,
        },
    ];

    const inputElements = inputFields.map((field) => {
        <div key={field.name}>
            <div>
                <label htmlFor={field.name}>
                    {field.required && <span className="text-red-500">*</span>}
                    {field.label} :
                </label>
                {error[field.name] && <div className="text-red-500 text-sm">{error[field.name]}</div>}
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
                      type = "submit"
                      disabled = {disabled}
                      onMouseHover= {onMouseHover}
                    />
                </form>
            ) : (
                <div>Please login to control channel details.</div>
            )}
        </div>
    );
}
