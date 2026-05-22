import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className="header">
                <div className="logo">FitZone</div>

                <button
                    className="menu-toggle"
                    onClick={() => setOpen(!open)}
                    aria-label="Abrir menú"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={open ? "open" : ""}>
                    <NavLink to="/" onClick={() => setOpen(false)}>Inicio</NavLink>
                    <NavLink to="/membresias" onClick={() => setOpen(false)}>Membresías</NavLink>
                    <NavLink to="/clases" onClick={() => setOpen(false)}>Clases</NavLink>
                    <NavLink to="/instalaciones" onClick={() => setOpen(false)}>Instalaciones</NavLink>
                    <NavLink to="/usuarios" onClick={() => setOpen(false)}>Usuarios</NavLink>
                    <NavLink to="/renovar" onClick={() => setOpen(false)}>Renovaciones</NavLink>
                    <NavLink to="/decisiones" onClick={() => setOpen(false)}>Decisiones</NavLink>
                    <NavLink to="/analisis-clases" onClick={() => setOpen(false)}>Análisis Clases</NavLink>
                    <NavLink to="/acceso" onClick={() => setOpen(false)}>Acceso</NavLink>
                    <NavLink to="/clases-crud" onClick={() => setOpen(false)}>CRUD Clases</NavLink>
                </nav>
            </header>
        </>
    );
}