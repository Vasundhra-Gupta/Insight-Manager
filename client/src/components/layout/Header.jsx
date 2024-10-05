import { useNavigate } from "react-router-dom";
import { Button, Logout } from "..";
import useUserContext from "../../Context/UserContext";

export default function Header() {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    return (
        <div>
            {user ? (
                <div>
                    <Logout />
                </div>
            ) : (
                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            navigate("/register");
                        }}
                        btnText="Sign Up"
                    />

                    <Button
                        onClick={() => {
                            navigate("/login");
                        }}
                        btnText="Login"
                    />
                </div>
            )}
        </div>
    );
}
