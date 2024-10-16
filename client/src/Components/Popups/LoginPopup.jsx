import { Login } from "..";
import { usePopupContext } from "../../Context";

export default function LoginPopup() {
    const { showLoginPopup } = usePopupContext();
    return showLoginPopup && <Login className="fixed inset-0 backdrop-blur-sm" />;
}
