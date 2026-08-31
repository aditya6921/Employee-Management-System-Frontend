
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://employee-management-system-prld.onrender.com/owners/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Registration failed");
            }

            alert("Registration successful!");

            navigate("/");

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>Employee Management</h1>

                <p>Owner Registration</p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

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

                    <button type="submit">
                        Register
                    </button>

                </form>

                <p>
                    Already have an account?
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Register;

