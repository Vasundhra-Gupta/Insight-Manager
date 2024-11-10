import { Outlet } from 'react-router-dom';
import { Header, Footer, Sidebar, Popup, LoginPopup } from '..';

export default function Layout() {
    return (
        <div className="text-white overflow-scroll h-full w-full">
            <Header />
            <Sidebar />
            <div className="px-6">
                <Outlet />
            </div>
            <hr className="mt-6 w-full" />
            <Footer />
            <Popup />
            <LoginPopup />
        </div>
    );
}
