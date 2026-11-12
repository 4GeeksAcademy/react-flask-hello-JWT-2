import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert("¡Usuario registrado con éxito!");
                navigate("/login");
            } else {
                const data = await response.json();
                alert(`Error: ${data.error || "No se pudo registrar"}`);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Hubo un error de conexión con el servidor.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Registrarse</button>
            </form>
        </div>
    );
};