import { useState, useEffect } from "react";
import { Layout } from "./components";
import useUserContext from "./context/userContext";
import { authService } from "./services/authService";

export default function App() {
    const { user, setUser } = useUserContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authService.getCurrentUser().then((data) => {
            if (data && !data.message) {
                setUser(data);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
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
