import { useState, useEffect } from "react";
import Header from "../components/Header";
import "./Acceso.css";

const usuariosRegistrados = [
    { celular: "4611002233", nombre: "Ana Martínez", membresia: "Premium", vencimiento: "2026-12-31", estado: "Activo" },
    { celular: "4612004455", nombre: "Carlos Vega", membresia: "Básico", vencimiento: "2026-06-01", estado: "Activo" },
    { celular: "4613006677", nombre: "Sofía Ruiz", membresia: "Anual", vencimiento: "2025-11-20", estado: "Activo" },
    { celular: "4614008899", nombre: "Diego Torres", membresia: "Premium", vencimiento: "2025-04-01", estado: "Inactivo" },
    { celular: "4615000011", nombre: "Laura Méndez", membresia: "Básico", vencimiento: "2026-08-10", estado: "Activo" },
];

export default function Acceso() {
    const [celular, setCelular] = useState("");
    const [resultado, setResultado] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [contador, setContador] = useState(null);

    // Auto-reset a los 3 segundos
    useEffect(() => {
        if (resultado === null) return;
        const timer = setTimeout(() => {
            setCelular("");
            setResultado(null);
            setUsuario(null);
            setContador(null);
        }, 3000);
        // Contador regresivo
        setContador(3);
        const intervalo = setInterval(() => {
            setContador(prev => {
                if (prev <= 1) { clearInterval(intervalo); return null; }
                return prev - 1;
            });
        }, 1000);
        return () => { clearTimeout(timer); clearInterval(intervalo); };
    }, [resultado]);

    function handleCelular(e) {
        const valor = e.target.value.replace(/\D/g, "").slice(0, 10);
        setCelular(valor);
        setResultado(null);
        setUsuario(null);
    }

    function verificar() {
        if (celular.length < 10) return;
        const encontrado = usuariosRegistrados.find(u => u.celular === celular);
        if (!encontrado) { setResultado("no-identificado"); setUsuario(null); return; }
        const hoy = new Date();
        const vence = new Date(encontrado.vencimiento);
        setUsuario(encontrado);
        setResultado(encontrado.estado === "Inactivo" || vence < hoy ? "vencido" : "acceso");
    }

    const config = {
        acceso: {
            icono: "fas fa-check-circle",
            clase: "resultado-acceso",
            titulo: "¡Acceso Concedido!",
            mensaje: usuario ? `Bienvenido/a, ${usuario.nombre}. Tu membresía ${usuario.membresia} está activa.` : "",
        },
        vencido: {
            icono: "fas fa-exclamation-circle",
            clase: "resultado-vencido",
            titulo: "Membresía Vencida",
            mensaje: usuario ? `${usuario.nombre}, tu membresía venció el ${usuario.vencimiento}. Por favor renuévala en recepción.` : "",
        },
        "no-identificado": {
            icono: "fas fa-times-circle",
            clase: "resultado-no-identificado",
            titulo: "Usuario No Identificado",
            mensaje: "No encontramos ningún registro con ese número. Acércate a recepción para registrarte.",
        },
    };

    return (
        <>
            <Header />
            <div className="acceso-pagina">
                <div className="acceso-card">
                    <div className="acceso-logo">FitZone</div>
                    <h1 className="acceso-titulo">Control de Acceso</h1>
                    <p className="acceso-subtitulo">Ingresa tu número de celular para verificar tu membresía</p>

                    <div className="acceso-campo">
                        <i className="fas fa-mobile-alt acceso-icono-input"></i>
                        <input
                            type="tel"
                            className="acceso-input"
                            placeholder="10 dígitos"
                            value={celular}
                            onChange={handleCelular}
                            onKeyDown={e => e.key === "Enter" && verificar()}
                            maxLength={10}
                            disabled={resultado !== null}
                        />
                        <span className="acceso-contador-digits">{celular.length}/10</span>
                    </div>

                    <button
                        className="acceso-boton"
                        onClick={verificar}
                        disabled={celular.length < 10 || resultado !== null}
                    >
                        <i className="fas fa-search"></i> Verificar Acceso
                    </button>

                    {resultado && (
                        <div className={`acceso-resultado ${config[resultado].clase}`}>
                            <i className={`${config[resultado].icono} acceso-resultado-icono`}></i>
                            <h2 className="acceso-resultado-titulo">{config[resultado].titulo}</h2>
                            <p className="acceso-resultado-mensaje">{config[resultado].mensaje}</p>
                            <div className="acceso-reset-bar">
                                <div className="acceso-reset-progreso"></div>
                            </div>
                            <p className="acceso-reset-texto">Reiniciando en {contador}s...</p>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}