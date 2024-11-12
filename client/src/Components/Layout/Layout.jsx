import { Outlet } from 'react-router-dom';
import { Header, Footer, Sidebar, Popup, LoginPopup } from '..';
import { SideBarContextProvider } from '../../Context/SideBarContext';

export default function Layout() {
    return (
        <div className="overflow-y-scroll h-full w-full">
            <SideBarContextProvider>
                <Header />
                <hr className="w-full" />
                <Sidebar />
            </SideBarContextProvider>
            <div className="mt-[60px] px-6 py-10 min-h-[calc(100%-60px)] w-full">
                <Outlet />
            </div>
            <hr className="w-full" />
            <Footer />
            <Popup />
            <LoginPopup />
        </div>
    );
}
