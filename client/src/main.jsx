import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";
import { LoginPage, HomePage, RegisterPage, PostPage, ProfilePage } from "./pages";
import { UserContextProvider } from "./context/userContext";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="post/:postId" element={<PostPage />} />
            <Route path="channel/:username" element={<ProfilePage />}>
                {/* <Route path="" element={<ChannelPosts/>}/> */}
            </Route>
        </Route>
    )
);

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <UserContextProvider>
        <RouterProvider router={router} />
    </UserContextProvider>
    // </StrictMode>,
);
