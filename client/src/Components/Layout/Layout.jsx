import { Header, Footer, Sidebar } from "..";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="text-white">
            <Header />
            <Sidebar />
            <Outlet />
            <Footer />
        </div>
    );
}
