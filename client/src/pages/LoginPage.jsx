import { useRef, useState } from "react";

export default function LoginPage() {
    const [inputs, setInputs] = useState({
        loginInput: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef();

    return <div>Login Page</div>;
}
