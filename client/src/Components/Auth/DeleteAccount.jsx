import useUserContext from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../Services/authService";
import { Button } from "..";

export default function DeleteAccount({ className = "" }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [password, setPassword] = useState("");

    async function handleClick() {
        setLoading(true);
        setDisabled(true);
        try {
            const res = await authService.deleteAccount(password);
            if (res && !res.message) {
                setUser(null);
            } else {
                setError(res?.message);
            }
        } catch (err) {
            navigate("/servor-error");
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    function onMouseOver() {
        if (!check || !password) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    return (
        <div className={className}>
            <div>
                {error && <div className="text-red-500">{error}</div>}
                <div>
                    <div>
                        <input
                            type="checkbox"
                            checked={check}
                            onChange={(e) => {
                                setCheck(e.target.checked);
                            }}
                            name="deleteCheckBox"
                            id="deleteCheckBox"
                        />
                        <label htmlFor="deleteCheckBox">
                            are you sure you want to delete the account permanently ?
                        </label>
                    </div>

                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            name="password"
                            id="password"
                            placeholder="Enter your password to confirm delete"
                            className="text-black"
                        />
                    </div>
                </div>
                <Button
                    onMouseOver={onMouseOver}
                    disabled={disabled}
                    onClick={handleClick}
                    btnText={loading ? "Deleting..." : "Delete Account"}
                />
            </div>
        </div>
    );
}
