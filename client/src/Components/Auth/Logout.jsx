import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context";
import { authService } from "../../Services";
import { Button } from "..";

export default function Logout() {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    async function handleClick() {
        setLoading(true);
        try {
            const res = await authService.logout();
            if (res && !res.message) {
                setUser(null);
            }
        } catch (err) {
            navigate("/servor-error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Button
                onClick={handleClick}
                disabled={loading}
                btnText={loading ? "Logging Out..." : "Logout"}
            />
        </div>
    );
}
