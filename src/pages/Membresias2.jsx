import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Membresias2.css";

const hoy = new Date();

function diasRestantes(fecha) {
    const diff = new Date(fecha) - hoy;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function nuevaFechaVencimiento(tipo) {
    const base = new Date();
    if (tipo === "Anual") base.setFullYear(base.getFullYear() + 1);
    else base.setMonth(base.getMonth() + 1);
    return base.toISOString().split("T")[0];
}

function diasSinMembresia(historialUsuario) {
    const expiradas = historialUsuario
        .filter(h => h.estado === "Expirada")
        .sort((a, b) => new Date(b.fin) - new Date(a.fin));
    if (!expiradas.length) return null;
    return Math.floor((hoy - new Date(expiradas[0].fin)) / (1000 * 60 * 60 * 24));
}

const historialInicial = [
    { id: 1, usuarioId: 1, nombre: "Ana Martínez", membresia: "Básico", inicio: "2024-01-15", fin: "2024-02-15", estado: "Expirada" },
    { id: 2, usuarioId: 1, nombre: "Ana Martínez", membresia: "Premium", inicio: "2024-02-15", fin: "2024-03-15", estado: "Expirada" },
    { id: 3, usuarioId: 1, nombre: "Ana Martínez", membresia: "Premium", inicio: "2024-03-15", fin: "2026-12-31", estado: "Activa" },
    { id: 4, usuarioId: 2, nombre: "Carlos Vega", membresia: "Básico", inicio: "2025-03-08", fin: "2026-06-01", estado: "Activa" },
    { id: 5, usuarioId: 3, nombre: "Sofía Ruiz", membresia: "Premium", inicio: "2024-06-01", fin: "2024-11-20", estado: "Expirada" },
    { id: 6, usuarioId: 3, nombre: "Sofía Ruiz", membresia: "Anual", inicio: "2024-11-20", fin: "2025-11-20", estado: "Expirada" },
    { id: 7, usuarioId: 3, nombre: "Sofía Ruiz", membresia: "Anual", inicio: "2025-11-20", fin: "2026-11-20", estado: "Activa" },
    { id: 8, usuarioId: 4, nombre: "Diego Torres", membresia: "Premium", inicio: "2025-01-01", fin: "2025-04-01", estado: "Expirada" },
    { id: 9, usuarioId: 5, nombre: "Laura Méndez", membresia: "Básico", inicio: "2025-04-10", fin: "2025-05-10", estado: "Expirada" },
    { id: 10, usuarioId: 5, nombre: "Laura Méndez", membresia: "Básico", inicio: "2025-05-10", fin: "2026-08-10", estado: "Activa" },
    { id: 11, usuarioId: 6, nombre: "Roberto Díaz", membresia: "Básico", inicio: "2024-03-01", fin: "2024-04-01", estado: "Expirada" },
    { id: 12, usuarioId: 7, nombre: "María López", membresia: "Premium", inicio: "2023-10-01", fin: "2023-11-01", estado: "Expirada" },
];

const PLANES = [
    { tipo: "Básico", precio: "$499/mes", color: "#CD7F32", clase: "etiqueta-basico" },
    { tipo: "Premium", precio: "$799/mes", color: "#C0C0C0", clase: "etiqueta-premium" },
    { tipo: "Anual", precio: "$7,999/año", color: "#D4AF37", clase: "etiqueta-anual" },
];

const estilosTabla = {
    table: { style: { backgroundColor: "transparent" } },
    headRow: { style: { backgroundColor: "#111", borderBottom: "2px solid #E10600" } },
    headCells: { style: { color: "#AAAAAA", fontFamily: "Montserrat, sans-serif", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "12px 10px" } },
    rows: { style: { backgroundColor: "#1A1A1A", borderBottom: "1px solid #222" }, highlightOnHoverStyle: { backgroundColor: "#202020", borderLeft: "3px solid #E10600" } },
    cells: { style: { color: "#F5F5F5", fontSize: "13px", padding: "10px 10px" } },
    pagination: { style: { backgroundColor: "#1A1A1A", color: "#AAAAAA", borderTop: "1px solid #222" } },
    noData: { style: { backgroundColor: "#1A1A1A", color: "#AAAAAA", padding: "24px" } },
};

function BadgeMembresia({ tipo }) {
    const p = PLANES.find(p => p.tipo === tipo);
    return <span className={`etiqueta ${p?.clase || ""}`}>{tipo}</span>;
}

function BadgeVencimiento({ fin, estadoActual }) {
    const dias = diasRestantes(fin);
    if (estadoActual === "Expirada") return <span className="etiqueta etiqueta-expirada">Expirada</span>;
    if (dias <= 0) return <span className="etiqueta etiqueta-vencida">Vencida</span>;
    if (dias <= 15) return <span className="etiqueta etiqueta-proxima">Vence en {dias}d</span>;
    return <span className="etiqueta etiqueta-vigente">Vigente</span>;
}

export default function Membresias2() {
    const [historial, setHistorial] = useState(historialInicial);
    const [siguienteId, setSiguienteId] = useState(13);
    const [busqueda, setBusqueda] = useState("");
    const [busquedaAlerta, setBusquedaAlerta] = useState("");
    const [busquedaInactivos, setBusquedaInactivos] = useState("");
    const [filtroUsuario, setFiltroUsuario] = useState("Todos");
    const [modalRenovar, setModalRenovar] = useState(false);
    const [usuarioRenovar, setUsuarioRenovar] = useState(null);
    const [planSeleccionado, setPlanSeleccionado] = useState("");
    const [modalReactivar, setModalReactivar] = useState(false);
    const [usuarioReactivar, setUsuarioReactivar] = useState(null);
    const [planReactivar, setPlanReactivar] = useState("");
    const [toast, setToast] = useState({ visible: false, msg: "" });

    const usuarios = useMemo(() => {
        const map = {};
        historial.forEach(h => { map[h.usuarioId] = h.nombre; });
        return Object.entries(map).map(([id, nombre]) => ({ id: Number(id), nombre }));
    }, [historial]);

    const activasPorUsuario = useMemo(() => {
        const map = {};
        historial.forEach(h => { if (h.estado === "Activa") map[h.usuarioId] = h; });
        return map;
    }, [historial]);

    const usuariosAlerta = useMemo(() => {
        return usuarios.map(u => {
            const activa = activasPorUsuario[u.id];
            if (!activa) return null;
            const dias = diasRestantes(activa.fin);
            let alerta = "vigente";
            if (dias <= 0) alerta = "vencida";
            else if (dias <= 15) alerta = "proxima";
            return alerta !== "vigente" ? { ...u, membresia: activa.membresia, fin: activa.fin, dias, alerta } : null;
        })
            .filter(Boolean)
            .filter(u =>
                u.nombre.toLowerCase().includes(busquedaAlerta.toLowerCase()) ||
                u.membresia.toLowerCase().includes(busquedaAlerta.toLowerCase())
            );
    }, [usuarios, activasPorUsuario, busquedaAlerta]);

    const clientesInactivos = useMemo(() => {
        return usuarios
            .filter(u => !activasPorUsuario[u.id])
            .map(u => {
                const historialU = historial.filter(h => h.usuarioId === u.id);
                const dias = diasSinMembresia(historialU);
                const ultimaMembresia = historialU
                    .filter(h => h.estado === "Expirada")
                    .sort((a, b) => new Date(b.fin) - new Date(a.fin))[0];
                return {
                    ...u,
                    dias,
                    ultimaMembresia: ultimaMembresia?.membresia || "—",
                    ultimaFin: ultimaMembresia?.fin || "—",
                };
            })
            .filter(u =>
                u.nombre.toLowerCase().includes(busquedaInactivos.toLowerCase()) ||
                u.ultimaMembresia.toLowerCase().includes(busquedaInactivos.toLowerCase())
            );
    }, [usuarios, activasPorUsuario, historial, busquedaInactivos]);

    const historialFiltrado = useMemo(() => {
        return historial
            .filter(h => {
                const coincideBusqueda =
                    h.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                    h.membresia.toLowerCase().includes(busqueda.toLowerCase());
                const coincideUsuario = filtroUsuario === "Todos" || h.nombre === filtroUsuario;
                return coincideBusqueda && coincideUsuario;
            })
            .sort((a, b) => new Date(b.inicio) - new Date(a.inicio));
    }, [historial, busqueda, filtroUsuario]);

    function mostrarToast(msg) {
        setToast({ visible: true, msg });
        setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
    }

    function abrirRenovar(usuarioId) {
        const u = usuarios.find(u => u.id === usuarioId);
        const activa = activasPorUsuario[usuarioId];
        setUsuarioRenovar({ ...u, activa });
        setPlanSeleccionado(activa?.membresia || "");
        setModalRenovar(true);
    }

    function confirmarRenovacion() {
        if (!planSeleccionado) { mostrarToast("⚠️ Selecciona un plan."); return; }
        const nuevaFin = nuevaFechaVencimiento(planSeleccionado);
        const nuevaInicio = new Date().toISOString().split("T")[0];
        setHistorial(prev => prev.map(h =>
            h.usuarioId === usuarioRenovar.id && h.estado === "Activa" ? { ...h, estado: "Expirada" } : h
        ));
        setHistorial(prev => [...prev, {
            id: siguienteId, usuarioId: usuarioRenovar.id, nombre: usuarioRenovar.nombre,
            membresia: planSeleccionado, inicio: nuevaInicio, fin: nuevaFin, estado: "Activa",
        }]);
        setSiguienteId(p => p + 1);
        setModalRenovar(false);
        mostrarToast(`✅ Membresía de ${usuarioRenovar.nombre} renovada a ${planSeleccionado}.`);
    }

    function abrirReactivar(usuario) {
        setUsuarioReactivar(usuario);
        setPlanReactivar(usuario.ultimaMembresia !== "—" ? usuario.ultimaMembresia : "");
        setModalReactivar(true);
    }

    function confirmarReactivacion() {
        if (!planReactivar) { mostrarToast("⚠️ Selecciona un plan."); return; }
        const nuevaFin = nuevaFechaVencimiento(planReactivar);
        const nuevaInicio = new Date().toISOString().split("T")[0];
        setHistorial(prev => [...prev, {
            id: siguienteId, usuarioId: usuarioReactivar.id, nombre: usuarioReactivar.nombre,
            membresia: planReactivar, inicio: nuevaInicio, fin: nuevaFin, estado: "Activa",
        }]);
        setSiguienteId(p => p + 1);
        setModalReactivar(false);
        mostrarToast(`✅ ¡${usuarioReactivar.nombre} reactivado con plan ${planReactivar}!`);
    }

    const columnasAlerta = [
        { name: "Usuario", selector: r => r.nombre, sortable: true, cell: r => <span className="nombre-usuario">{r.nombre}</span> },
        { name: "Membresía", selector: r => r.membresia, sortable: true, cell: r => <BadgeMembresia tipo={r.membresia} /> },
        { name: "Vencimiento", selector: r => r.fin, sortable: true },
        {
            name: "Estado",
            cell: r => r.alerta === "vencida"
                ? <span className="etiqueta etiqueta-vencida">Vencida</span>
                : <span className="etiqueta etiqueta-proxima">Vence en {r.dias}d</span>
        },
        {
            name: "Acción", ignoreRowClick: true,
            cell: r => (
                <button className="boton-renovar" onClick={() => abrirRenovar(r.id)}>
                    <i className="fas fa-sync-alt"></i> Renovar
                </button>
            ),
        },
    ];

    const columnasInactivos = [
        { name: "Cliente", selector: r => r.nombre, sortable: true, cell: r => <span className="nombre-usuario">{r.nombre}</span> },
        {
            name: "Último plan", selector: r => r.ultimaMembresia, sortable: true,
            cell: r => r.ultimaMembresia !== "—"
                ? <BadgeMembresia tipo={r.ultimaMembresia} />
                : <span className="etiqueta etiqueta-expirada">Sin historial</span>
        },
        { name: "Venció el", selector: r => r.ultimaFin, sortable: true },
        {
            name: "Tiempo inactivo", selector: r => r.dias, sortable: true,
            cell: r => {
                if (r.dias === null) return <span className="etiqueta etiqueta-expirada">Sin membresía previa</span>;
                if (r.dias > 90) return <span className="etiqueta etiqueta-vencida">+{r.dias} días</span>;
                if (r.dias > 30) return <span className="etiqueta etiqueta-proxima">{r.dias} días</span>;
                return <span className="etiqueta etiqueta-expirada">{r.dias} días</span>;
            }
        },
        {
            name: "Acción", ignoreRowClick: true,
            cell: r => (
                <button className="boton-reactivar" onClick={() => abrirReactivar(r)}>
                    <i className="fas fa-user-check"></i> Reactivar
                </button>
            ),
        },
    ];

    const columnasHistorial = [
        { name: "Usuario", selector: r => r.nombre, sortable: true, cell: r => <span className="nombre-usuario">{r.nombre}</span> },
        { name: "Membresía", selector: r => r.membresia, sortable: true, cell: r => <BadgeMembresia tipo={r.membresia} /> },
        { name: "Inicio", selector: r => r.inicio, sortable: true },
        { name: "Vencimiento", selector: r => r.fin, sortable: true },
        {
            name: "Estado", selector: r => r.estado, sortable: true,
            cell: r => <BadgeVencimiento fin={r.fin} estadoActual={r.estado} />
        },
    ];

    return (
        <>
            <Header />
            <main className="contenido-principal">

                <div className="cabecera-pagina">
                    <div>
                        <h1 className="titulo-pagina">Gestión de Membresías</h1>
                        <p className="subtitulo-pagina">Renueva, reactiva y consulta el historial completo</p>
                    </div>
                </div>

                {/* Alertas de renovación */}
                {(usuariosAlerta.length > 0 || busquedaAlerta) && (
                    <div className="contenedor-tabla" style={{ marginBottom: "32px" }}>
                        <div className="cabecera-seccion">
                            <h2 className="titulo-seccion"><i className="fas fa-bell"></i> Requieren Renovación</h2>
                            <span className="badge-alerta">{usuariosAlerta.length}</span>
                        </div>
                        <p className="subtitulo-seccion">Usuarios con membresía vencida o próxima a vencer</p>
                        <div className="barra-filtros">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o membresía..."
                                value={busquedaAlerta}
                                onChange={e => setBusquedaAlerta(e.target.value)}
                                className="input-busqueda"
                            />
                        </div>
                        <DataTable
                            columns={columnasAlerta}
                            data={usuariosAlerta}
                            customStyles={estilosTabla}
                            noDataComponent={<div style={{ padding: "24px", color: "#aaa" }}>Sin alertas pendientes</div>}
                            highlightOnHover
                        />
                    </div>
                )}

                {/* Clientes inactivos */}
                {(clientesInactivos.length > 0 || busquedaInactivos) && (
                    <div className="contenedor-tabla" style={{ marginBottom: "32px" }}>
                        <div className="cabecera-seccion">
                            <h2 className="titulo-seccion"><i className="fas fa-user-clock"></i> Clientes Sin Membresía Activa</h2>
                            <span className="badge-inactivo">{clientesInactivos.length}</span>
                        </div>
                        <p className="subtitulo-seccion">Clientes registrados sin membresía vigente actualmente</p>
                        <div className="barra-filtros">
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                value={busquedaInactivos}
                                onChange={e => setBusquedaInactivos(e.target.value)}
                                className="input-busqueda"
                            />
                        </div>
                        <DataTable
                            columns={columnasInactivos}
                            data={clientesInactivos}
                            customStyles={estilosTabla}
                            noDataComponent={<div style={{ padding: "24px", color: "#aaa" }}>Todos los clientes tienen membresía activa</div>}
                            highlightOnHover
                        />
                    </div>
                )}

                {/* Historial completo */}
                <div className="contenedor-tabla">
                    <div className="cabecera-seccion">
                        <h2 className="titulo-seccion"><i className="fas fa-history"></i> Historial de Membresías</h2>
                    </div>
                    <p className="subtitulo-seccion">Registro completo de todas las membresías activas y pasadas</p>
                    <div className="barra-filtros">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o membresía..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="input-busqueda"
                        />
                        <select
                            className="select-filtro"
                            value={filtroUsuario}
                            onChange={e => setFiltroUsuario(e.target.value)}
                        >
                            <option value="Todos">Todos los usuarios</option>
                            {usuarios.map(u => (
                                <option key={u.id} value={u.nombre}>{u.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <DataTable
                        columns={columnasHistorial}
                        data={historialFiltrado}
                        customStyles={estilosTabla}
                        pagination
                        paginationPerPage={6}
                        paginationRowsPerPageOptions={[6, 12, 20]}
                        paginationComponentOptions={{ rowsPerPageText: "Filas por página:", rangeSeparatorText: "de" }}
                        noDataComponent={<div style={{ padding: "24px", color: "#aaa" }}>No se encontraron registros</div>}
                        highlightOnHover
                        pointerOnHover
                    />
                </div>

            </main>

            {/* Modal Renovar */}
            {modalRenovar && usuarioRenovar && (
                <div className="fondo-modal visible" onClick={e => { if (e.target.classList.contains("fondo-modal")) setModalRenovar(false); }}>
                    <div className="ventana-modal ventana-renovar">
                        <div className="cabecera-modal">
                            <h2><i className="fas fa-sync-alt"></i> Renovar Membresía</h2>
                            <button className="cerrar-modal" onClick={() => setModalRenovar(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="cuerpo-modal">
                            <p className="renovar-nombre">{usuarioRenovar.nombre}</p>
                            {usuarioRenovar.activa && (
                                <p className="renovar-actual">
                                    Plan actual: <BadgeMembresia tipo={usuarioRenovar.activa.membresia} /> — Vence: {usuarioRenovar.activa.fin}
                                </p>
                            )}
                            <p className="renovar-label">Selecciona el nuevo plan:</p>
                            <div className="planes-renovar">
                                {PLANES.map(plan => (
                                    <div
                                        key={plan.tipo}
                                        className={`plan-opcion ${planSeleccionado === plan.tipo ? "seleccionado" : ""}`}
                                        style={{ "--color-plan": plan.color }}
                                        onClick={() => setPlanSeleccionado(plan.tipo)}
                                    >
                                        <span className="plan-nombre">{plan.tipo}</span>
                                        <span className="plan-precio">{plan.precio}</span>
                                        {planSeleccionado === plan.tipo && <i className="fas fa-check-circle plan-check"></i>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pie-modal">
                            <button className="boton-cancelar" onClick={() => setModalRenovar(false)}>Cancelar</button>
                            <button className="boton-guardar" onClick={confirmarRenovacion}>
                                <i className="fas fa-sync-alt"></i> Confirmar Renovación
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Reactivar */}
            {modalReactivar && usuarioReactivar && (
                <div className="fondo-modal visible" onClick={e => { if (e.target.classList.contains("fondo-modal")) setModalReactivar(false); }}>
                    <div className="ventana-modal ventana-renovar">
                        <div className="cabecera-modal cabecera-reactivar">
                            <h2><i className="fas fa-user-check"></i> Reactivar Cliente</h2>
                            <button className="cerrar-modal" onClick={() => setModalReactivar(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="cuerpo-modal">
                            <div className="reactivar-info">
                                <i className="fas fa-user-circle reactivar-icono"></i>
                                <div>
                                    <p className="renovar-nombre">{usuarioReactivar.nombre}</p>
                                    <p className="reactivar-detalle">
                                        {usuarioReactivar.dias !== null
                                            ? `Inactivo hace ${usuarioReactivar.dias} días — Último plan: ${usuarioReactivar.ultimaMembresia}`
                                            : "Cliente sin membresía previa"}
                                    </p>
                                </div>
                            </div>
                            {usuarioReactivar.dias > 90 && (
                                <div className="alerta-regreso">
                                    <i className="fas fa-star"></i>
                                    ¡Es momento de recuperar a este cliente! Considera ofrecerle una promoción.
                                </div>
                            )}
                            <p className="renovar-label" style={{ marginTop: "20px" }}>Selecciona el plan a asignar:</p>
                            <div className="planes-renovar">
                                {PLANES.map(plan => (
                                    <div
                                        key={plan.tipo}
                                        className={`plan-opcion ${planReactivar === plan.tipo ? "seleccionado" : ""}`}
                                        style={{ "--color-plan": plan.color }}
                                        onClick={() => setPlanReactivar(plan.tipo)}
                                    >
                                        <span className="plan-nombre">{plan.tipo}</span>
                                        <span className="plan-precio">{plan.precio}</span>
                                        {planReactivar === plan.tipo && <i className="fas fa-check-circle plan-check"></i>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pie-modal">
                            <button className="boton-cancelar" onClick={() => setModalReactivar(false)}>Cancelar</button>
                            <button className="boton-guardar boton-reactivar-confirmar" onClick={confirmarReactivacion}>
                                <i className="fas fa-user-check"></i> Confirmar Reactivación
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast.visible && <div className="notificacion visible">{toast.msg}</div>}
            <Footer />
        </>
    );
}