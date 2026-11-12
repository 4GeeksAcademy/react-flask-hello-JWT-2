import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchPrivateData = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            try {
                const response = await fetch(`${backendUrl}/api/private`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    sessionStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error validando el token:", error);
                sessionStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchPrivateData();
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    if (!userData) {
        return <div className="container mt-5">Verificando acceso...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Zona Privada</h2>
            <div className="alert alert-success">
                <p><strong>Estado:</strong> {userData.message}</p>
                <p><strong>Usuario autenticado:</strong> {userData.logged_in_as}</p>
            </div>
            <button onClick={handleLogout} className="btn btn-danger">
                Cerrar sesión
            </button>
        </div>
    );
};