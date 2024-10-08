import { Header, Footer, Sidebar } from "..";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="text-white overflow-scroll h-full w-full">
            <Header />
            <Sidebar />
            <Outlet />
            <Footer />
        </div>
    );
}
