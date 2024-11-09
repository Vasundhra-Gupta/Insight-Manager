import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Components';
import { useUserContext } from './Context';
import { authService } from './Services';
import { icons } from './Assets/icons';

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
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="bg-black h-screen w-screen">
            {loading ? (
                <div className="text-3xl text-white h-full w-full flex flex-col items-center justify-center">
                    <div className="size-[50px] fill-[#8871ee] dark:text-[#b5b4b4]">
                        {icons.loading}
                    </div>
                    <div>Please Wait...</div>
                    <div>Refresh the page, if it takes too long</div>
                </div>
            ) : (
                <Layout />
            )}
        </div>
    );
}
