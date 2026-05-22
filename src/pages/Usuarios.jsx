import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import ModalConfirmar from "../components/ModalConfirmar";
import "./Usuarios.css";

const usuariosIniciales = [
    { id: 1, nombre: "Ana", apellidos: "Martínez López", correo: "ana.martinez@mail.com", telefono: "461 100 2233", membresia: "Premium", fecha: "2025-01-15", estado: "Activo", notas: "Spinning y cardio" },
    { id: 2, nombre: "Carlos", apellidos: "Vega Hernández", correo: "carlos.vega@mail.com", telefono: "461 200 4455", membresia: "Básico", fecha: "2025-03-08", estado: "Activo", notas: "" },
    { id: 3, nombre: "Sofía", apellidos: "Ruiz Torres", correo: "sofia.ruiz@mail.com", telefono: "461 300 6677", membresia: "Anual", fecha: "2024-11-20", estado: "Activo", notas: "Evaluación pendiente" },
    { id: 4, nombre: "Diego", apellidos: "Torres Sánchez", correo: "diego.torres@mail.com", telefono: "461 400 8899", membresia: "Premium", fecha: "2025-02-01", estado: "Inactivo", notas: "Pagó hasta abril" },
    { id: 5, nombre: "Laura", apellidos: "Méndez García", correo: "laura.mendez@mail.com", telefono: "461 500 0011", membresia: "Básico", fecha: "2025-04-10", estado: "Activo", notas: "" },
];

function BadgeMembresia({ tipo }) {
    const clases = { Básico: "etiqueta-basico", Premium: "etiqueta-premium", Anual: "etiqueta-anual" };
    return <span className={`etiqueta ${clases[tipo] || ""}`}>{tipo}</span>;
}

function BadgeEstado({ estado }) {
    return (
        <span className={`etiqueta ${estado === "Activo" ? "etiqueta-activo" : "etiqueta-inactivo"}`}>
            <i className="fas fa-circle" style={{ fontSize: "8px" }}></i> {estado}
        </span>
    );
}

const estilosTabla = {
    table: { style: { backgroundColor: "transparent" } },
    headRow: { style: { backgroundColor: "#111", borderBottom: "2px solid #E10600" } },
    headCells: { style: { color: "#AAAAAA", fontFamily: "Montserrat, sans-serif", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "12px 10px" } },
    rows: { style: { backgroundColor: "#1A1A1A", borderBottom: "1px solid #222 !important", cursor: "pointer" }, highlightOnHoverStyle: { backgroundColor: "#202020", borderLeft: "3px solid #E10600" } },
    cells: { style: { color: "#F5F5F5", fontSize: "14px", padding: "12px 10px" } },
    pagination: { style: { backgroundColor: "#1A1A1A", color: "#AAAAAA", borderTop: "1px solid #222" } },
    noData: { style: { backgroundColor: "#1A1A1A", color: "#AAAAAA" } },
};

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState(usuariosIniciales);
    const [siguienteId, setSiguienteId] = useState(6);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [eliminarId, setEliminarId] = useState(null);
    const [detalleId, setDetalleId] = useState(null);
    const [toast, setToast] = useState({ visible: false, msg: "" });
    const [form, setForm] = useState({
        nombre: "", apellidos: "", correo: "", telefono: "",
        membresia: "", fecha: new Date().toISOString().split("T")[0],
        estado: "Activo", notas: ""
    });

    const usuariosFiltrados = useMemo(() =>
        usuarios.filter(u =>
            `${u.nombre} ${u.apellidos} ${u.correo} ${u.membresia} ${u.estado}`
                .toLowerCase().includes(busqueda.toLowerCase())
        ), [usuarios, busqueda]);

    const stats = [
        { icono: "fas fa-users", numero: usuarios.length, etiqueta: "Total usuarios" },
        { icono: "fas fa-check-circle", numero: usuarios.filter(u => u.estado === "Activo").length, etiqueta: "Activos" },
        { icono: "fas fa-user-slash", numero: usuarios.filter(u => u.estado === "Inactivo").length, etiqueta: "Inactivos" },
        { icono: "fas fa-id-card", numero: usuarios.filter(u => u.membresia === "Básico").length, etiqueta: "Básico" },
        { icono: "fas fa-crown", numero: usuarios.filter(u => u.membresia === "Premium").length, etiqueta: "Premium" },
        { icono: "fas fa-calendar-alt", numero: usuarios.filter(u => u.membresia === "Anual").length, etiqueta: "Plan anual" },
    ];

    const columnas = [
        { name: "#", selector: (_, i) => i + 1, width: "60px" },
        { name: "Nombre", selector: r => `${r.nombre} ${r.apellidos}`, cell: r => <span className="nombre-usuario">{r.nombre} {r.apellidos}</span>, sortable: true },
        { name: "Correo", selector: r => r.correo, sortable: true },
        { name: "Teléfono", selector: r => r.telefono || "—" },
        { name: "Membresía", selector: r => r.membresia, cell: r => <BadgeMembresia tipo={r.membresia} />, sortable: true },
        { name: "Registro", selector: r => r.fecha, sortable: true },
        { name: "Estado", selector: r => r.estado, cell: r => <BadgeEstado estado={r.estado} />, sortable: true },
        {
            name: "Acciones",
            cell: r => (
                <div className="botones-accion">
                    <button className="boton-editar" onClick={e => { e.stopPropagation(); abrirEditar(r.id); }} title="Editar"><i className="fas fa-edit"></i></button>
                    <button className="boton-borrar" onClick={e => { e.stopPropagation(); setEliminarId(r.id); }} title="Eliminar"><i className="fas fa-trash-alt"></i></button>
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    function mostrarToast(msg) {
        setToast({ visible: true, msg });
        setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
    }

    function abrirNuevo() {
        setEditandoId(null);
        setForm({ nombre: "", apellidos: "", correo: "", telefono: "", membresia: "", fecha: new Date().toISOString().split("T")[0], estado: "Activo", notas: "" });
        setModalAbierto(true);
    }

    function abrirEditar(id) {
        const u = usuarios.find(u => u.id === id);
        if (!u) return;
        setEditandoId(id);
        setForm({ nombre: u.nombre, apellidos: u.apellidos, correo: u.correo, telefono: u.telefono, membresia: u.membresia, fecha: u.fecha, estado: u.estado, notas: u.notas });
        setModalAbierto(true);
    }

    function guardar() {
        if (!form.nombre || !form.apellidos || !form.correo || !form.membresia || !form.fecha) {
            mostrarToast("⚠️ Completa los campos obligatorios."); return;
        }
        if (editandoId) {
            setUsuarios(prev => prev.map(u => u.id === editandoId ? { ...u, ...form } : u));
            mostrarToast("✅ Usuario actualizado correctamente.");
        } else {
            setUsuarios(prev => [...prev, { id: siguienteId, ...form }]);
            setSiguienteId(p => p + 1);
            mostrarToast("✅ Usuario registrado correctamente.");
        }
        setModalAbierto(false);
    }

    function eliminar() {
        setUsuarios(prev => prev.filter(u => u.id !== eliminarId));
        setEliminarId(null);
        mostrarToast("🗑️ Usuario eliminado.");
    }

    const usuarioEliminar = usuarios.find(u => u.id === eliminarId);
    const usuarioDetalle = usuarios.find(u => u.id === detalleId);

    return (
        <>
            <Header />
            <main className="contenido-principal">

                <div className="cabecera-pagina">
                    <div>
                        <h1 className="titulo-pagina">Gestión de Usuarios</h1>
                        <p className="subtitulo-pagina">Administra los miembros registrados en FitZone</p>
                    </div>
                    <button className="boton-nuevo" onClick={abrirNuevo}>
                        <i className="fas fa-plus"></i> Nuevo Usuario
                    </button>
                </div>

                <div className="fila-estadisticas">
                    {stats.map(s => <StatCard key={s.etiqueta} icono={s.icono} numero={s.numero} etiqueta={s.etiqueta} />)}
                </div>

                <div className="contenedor-tabla">
                    {/* Barra de búsqueda */}
                    <div className="barra-busqueda">
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="input-busqueda"
                        />
                    </div>

                    <DataTable
                        columns={columnas}
                        data={usuariosFiltrados}
                        customStyles={estilosTabla}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 20]}
                        paginationComponentOptions={{ rowsPerPageText: "Filas por página:", rangeSeparatorText: "de", noRowsPerPage: false }}
                        noDataComponent={<div style={{ padding: "24px", color: "#aaa" }}>No se encontraron resultados</div>}
                        onRowClicked={row => setDetalleId(row.id)}
                        highlightOnHover
                        pointerOnHover
                    />
                </div>

            </main>

            {/* Modal Nuevo/Editar */}
            {modalAbierto && (
                <div className="fondo-modal visible" onClick={e => { if (e.target.classList.contains("fondo-modal")) setModalAbierto(false); }}>
                    <div className="ventana-modal">
                        <div className="cabecera-modal">
                            <h2><i className={`fas ${editandoId ? "fa-user-edit" : "fa-user-plus"}`}></i> {editandoId ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                            <button className="cerrar-modal" onClick={() => setModalAbierto(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="cuerpo-modal">
                            <div className="cuadricula-formulario">
                                {[
                                    { label: "Nombre", id: "nombre", placeholder: "Ej. Juan", required: true },
                                    { label: "Apellidos", id: "apellidos", placeholder: "Ej. García Ramírez", required: true },
                                    { label: "Correo electrónico", id: "correo", placeholder: "correo@ejemplo.com", required: true, type: "email" },
                                    { label: "Teléfono", id: "telefono", placeholder: "461 123 4567", required: false },
                                ].map(f => (
                                    <div className="grupo-campo" key={f.id}>
                                        <label>{f.label} {f.required && <span className="obligatorio">*</span>}</label>
                                        <input type={f.type || "text"} placeholder={f.placeholder}
                                            value={form[f.id]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} />
                                    </div>
                                ))}
                                <div className="grupo-campo">
                                    <label>Membresía <span className="obligatorio">*</span></label>
                                    <select value={form.membresia} onChange={e => setForm(p => ({ ...p, membresia: e.target.value }))}>
                                        <option value="">-- Selecciona --</option>
                                        <option value="Básico">Básico – $499/mes</option>
                                        <option value="Premium">Premium – $799/mes</option>
                                        <option value="Anual">Anual – $7,999/año</option>
                                    </select>
                                </div>
                                <div className="grupo-campo">
                                    <label>Fecha de registro <span className="obligatorio">*</span></label>
                                    <input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} />
                                </div>
                                <div className="grupo-campo">
                                    <label>Estado</label>
                                    <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                                <div className="grupo-campo">
                                    <label>Notas</label>
                                    <input type="text" placeholder="Observaciones opcionales"
                                        value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="pie-modal">
                            <button className="boton-cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
                            <button className="boton-guardar" onClick={guardar}><i className="fas fa-save"></i> Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            <ModalConfirmar
                visible={!!eliminarId}
                nombre={usuarioEliminar ? `${usuarioEliminar.nombre} ${usuarioEliminar.apellidos}` : ""}
                onConfirmar={eliminar}
                onCancelar={() => setEliminarId(null)}
            />

            {detalleId && usuarioDetalle && (
                <div className="fondo-modal visible" onClick={e => { if (e.target.classList.contains("fondo-modal")) setDetalleId(null); }}>
                    <div className="ventana-modal ventana-pequena">
                        <div className="cabecera-modal">
                            <h2><i className="fas fa-user"></i> {usuarioDetalle.nombre} {usuarioDetalle.apellidos}</h2>
                            <button className="cerrar-modal" onClick={() => setDetalleId(null)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="cuerpo-detalle">
                            {[
                                { icono: "fa-envelope", label: "Correo", valor: usuarioDetalle.correo },
                                { icono: "fa-phone", label: "Teléfono", valor: usuarioDetalle.telefono || "—" },
                                { icono: "fa-calendar-alt", label: "Registro", valor: usuarioDetalle.fecha },
                                { icono: "fa-sticky-note", label: "Notas", valor: usuarioDetalle.notas || "Sin notas" },
                            ].map(d => (
                                <div className="fila-detalle" key={d.label}>
                                    <span className="etiqueta-detalle"><i className={`fas ${d.icono}`}></i> {d.label}</span>
                                    <span className="valor-detalle">{d.valor}</span>
                                </div>
                            ))}
                            <div className="fila-detalle">
                                <span className="etiqueta-detalle"><i className="fas fa-id-card"></i> Membresía</span>
                                <span className="valor-detalle"><BadgeMembresia tipo={usuarioDetalle.membresia} /></span>
                            </div>
                            <div className="fila-detalle">
                                <span className="etiqueta-detalle"><i className="fas fa-circle"></i> Estado</span>
                                <span className="valor-detalle"><BadgeEstado estado={usuarioDetalle.estado} /></span>
                            </div>
                        </div>
                        <div className="pie-modal">
                            <button className="boton-editar-detalle" onClick={() => { setDetalleId(null); abrirEditar(detalleId); }}>
                                <i className="fas fa-edit"></i> Editar
                            </button>
                            <button className="boton-borrar-detalle" onClick={() => { setDetalleId(null); setEliminarId(detalleId); }}>
                                <i className="fas fa-trash-alt"></i> Eliminar
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