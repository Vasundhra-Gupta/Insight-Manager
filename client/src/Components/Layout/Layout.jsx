import { Outlet } from "react-router-dom";
import { Header, Footer, Sidebar, Popup, LoginPopup } from "..";

export default function Layout() {
    return (
        <div className="text-white overflow-scroll h-full w-full">
            <Header />
            <Sidebar />
            <Outlet />
            <Footer />
            <Popup />
            <LoginPopup />
        </div>
    );
}
