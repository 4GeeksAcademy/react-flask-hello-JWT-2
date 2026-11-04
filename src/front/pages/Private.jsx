import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch(process.env.BACKEND_URL + "/api/private", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(resp => {
            if (!resp.ok) throw new Error("Token inválido");
            return resp.json();
        })
        .then(data => setMensaje(data.message))
        .catch(() => {
            sessionStorage.removeItem("token");
            navigate("/login");
        });
    }, []);

    return (
        <div className="container mt-5 text-center">
            <h1>Zona Privada</h1>
            <p>{mensaje || "Cargando..."}</p>
            <button className="btn btn-danger mt-3" onClick={() => {
                sessionStorage.removeItem("token");
                navigate("/login");
            }}>
                Cerrar Sesión
            </button>
        </div>
    );
};