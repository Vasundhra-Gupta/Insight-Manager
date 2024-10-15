import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "./Components";
import { useUserContext } from "./Context";
import { authService } from "./Services";

export default function App() {
    const { setUser } = useUserContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async function currentUser() {
            try {
                const data = await authService.getCurrentUser();
                if (data && !data.message) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                navigate("/server-error");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="bg-black h-screen w-screen">
            {loading ? (
                <div className="text-3xl text-white h-full w-full flex items-center justify-center">
                    Please Wait...
                </div>
            ) : (
                <Layout />
            )}
        </div>
    );
}
