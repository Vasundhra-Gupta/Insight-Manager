import { Outlet } from "react-router-dom";
import { UpdateAvatar, UpdateCoverImage } from "../Components";
import useUserContext from "../Context/UserContext";

export default function SettingsPage() {
    const { user, setUser } = useUserContext();
    return (
        <div>
            <div>SettingsPage</div>
            <div>
                <UpdateAvatar />
                <UpdateCoverImage />
            </div>
            <Outlet />
        </div>
    );
}
