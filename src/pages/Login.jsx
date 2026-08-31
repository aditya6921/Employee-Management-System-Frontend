
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(
                "http://localhost:8080/owners/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            if (!response.ok) {
                setError(
                    "Invalid email or password. New user? Please register first."
                );
                return;
            }

            const owner = await response.json();

            // Save logged-in owner information
            localStorage.setItem("ownerId", owner.ownerId);
            localStorage.setItem("ownerName", owner.name);
            localStorage.setItem("ownerEmail", owner.email);

            // Navigate to dashboard
            navigate("/dashboard");

        } catch (error) {
            setError(
                "Unable to connect to server. Please try again."
            );
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>Employee Management</h1>

                <p>Owner Login</p>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p>New owner?</p>

                <button
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>

            </div>

        </div>
    );
}

export default Login;

