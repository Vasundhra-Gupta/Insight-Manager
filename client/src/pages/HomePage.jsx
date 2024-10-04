import useUserContext from "../context/UserContext";

export default function HomePage() {
    const { user } = useUserContext();
    return user ? <div>HomePage user logged in</div> : <div>HomePage user not logged in</div>;
}
