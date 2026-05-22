import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import ModalConfirmar from "../components/ModalConfirmar";
import "./ClasesCrud.css";

const clasesIniciales = [
    { id: 1, clase: "Spinning", instructor: "Laura Méndez", horaInicio: "07:00", horaFin: "08:00", dias: ["Lun", "Mié", "Vie"], cupos: 15, estado: "Activa", descripcion: "" },
    { id: 2, clase: "Crossfit", instructor: "Carlos Vega", horaInicio: "18:00", horaFin: "19:00", dias: ["Mar", "Jue"], cupos: 10, estado: "Activa", descripcion: "" },
    { id: 3, clase: "Yoga", instructor: "Sofía Ruiz", horaInicio: "20:00", horaFin: "21:00", dias: ["Lun", "Mié", "Vie"], cupos: 12, estado: "Activa", descripcion: "" },
    { id: 4, clase: "Funcional", instructor: "Diego Torres", horaInicio: "17:00", horaFin: "18:00", dias: ["Mar", "Jue", "Sáb"], cupos: 8, estado: "Inactiva", descripcion: "" },
];

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const CLASES_OPCIONES = ["Spinning", "Crossfit", "Yoga", "Funcional", "Zumba", "Pilates", "Box", "Natación", "TRX", "Otra"];
// --- NUEVO: Lista de instructores ---
const INSTRUCTORES_OPCIONES = ["Laura Méndez", "Carlos Vega", "Sofía Ruiz", "Diego Torres", "Ana López", "Miguel Ángel"];


function formatHora(h) {
    if (!h) return "";
    const [hh, mm] = h.split(":");
    const hora = parseInt(hh);
    return `${hora > 12 ? hora - 12 : hora}:${mm} ${hora >= 12 ? "PM" : "AM"}`;
}

function BadgeEstado({ estado }) {
    return (
        <span className={`etiqueta ${estado === "Activa" ? "etiqueta-activo" : "etiqueta-inactivo"}`}>
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

export default function ClasesCrud() {
    const [clases, setClases] = useState(clasesIniciales);
    const [siguienteId, setSiguienteId] = useState(5);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [eliminarId, setEliminarId] = useState(null);
    const [detalleId, setDetalleId] = useState(null);
    const [toast, setToast] = useState({ visible: false, msg: "" });
    const [form, setForm] = useState({
        clase: "", clasePersonalizada: "", instructor: "",
        horaInicio: "", horaFin: "", dias: [],
        cupos: "", estado: "Activa", descripcion: ""
    });

    const clasesFiltradas = useMemo(() =>
        clases.filter(c =>
            `${c.clase} ${c.instructor} ${c.estado} ${c.dias.join(" ")}`
                .toLowerCase().includes(busqueda.toLowerCase())
        ), [clases, busqueda]);

    const stats = [
        { icono: "fas fa-chalkboard-teacher", numero: clases.length, etiqueta: "Total clases" },
        { icono: "fas fa-check-circle", numero: clases.filter(c => c.estado === "Activa").length, etiqueta: "Activas" },
        { icono: "fas fa-pause-circle", numero: clases.filter(c => c.estado === "Inactiva").length, etiqueta: "Inactivas" },
        { icono: "fas fa-users", numero: clases.reduce((a, c) => a + c.cupos, 0), etiqueta: "Cupos disponibles" },
        { icono: "fas fa-user-tie", numero: new Set(clases.map(c => c.instructor)).size, etiqueta: "Instructores" },
    ];

    const columnas = [
        { name: "#", selector: (_, i) => i + 1, width: "60px" },
        { name: "Clase", selector: r => r.clase, cell: r => <span className="nombre-usuario">{r.clase}</span>, sortable: true },
        { name: "Instructor", selector: r => r.instructor, sortable: true },
        { name: "Horario", selector: r => r.horaInicio, cell: r => `${formatHora(r.horaInicio)} – ${formatHora(r.horaFin)}`, sortable: true },
        { name: "Días", selector: r => r.dias.join(", ") },
        { name: "Cupos", selector: r => r.cupos, sortable: true, width: "90px" },
        { name: "Estado", selector: r => r.estado, cell: r => <BadgeEstado estado={r.estado} />, sortable: true },
        {
            name: "Acciones",
            cell: r => (
                <div className="botones-accion">
                    <button className="boton-editar" onClick={e => { e.stopPropagation(); abrirEditar(r.id); }} title="Editar">
                        <i className="fas fa-edit"></i>
                    </button>
                    <button className="boton-borrar" onClick={e => { e.stopPropagation(); setEliminarId(r.id); }} title="Eliminar">
                        <i className="fas fa-trash-alt"></i>
                    </button>
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
        setForm({ clase: "", clasePersonalizada: "", instructor: "", horaInicio: "", horaFin: "", dias: [], cupos: "", estado: "Activa", descripcion: "" });
        setModalAbierto(true);
    }

    function abrirEditar(id) {
        const c = clases.find(c => c.id === id);
        if (!c) return;
        setEditandoId(id);
        setForm({ clase: c.clase, clasePersonalizada: "", instructor: c.instructor, horaInicio: c.horaInicio, horaFin: c.horaFin, dias: [...c.dias], cupos: c.cupos, estado: c.estado, descripcion: c.descripcion });
        setModalAbierto(true);
    }

    function toggleDia(dia) {
        setForm(p => ({
            ...p,
            dias: p.dias.includes(dia) ? p.dias.filter(d => d !== dia) : [...p.dias, dia]
        }));
    }

    function guardar() {
        const claseVal = form.clase === "Otra" ? form.clasePersonalizada : form.clase;
        if (!claseVal || !form.instructor || !form.horaInicio || !form.horaFin || form.dias.length === 0 || !form.cupos) {
            mostrarToast("⚠️ Completa los campos obligatorios."); return;
        }
        const datos = {
            clase: claseVal, instructor: form.instructor,
            horaInicio: form.horaInicio, horaFin: form.horaFin,
            dias: form.dias, cupos: Number(form.cupos),
            estado: form.estado, descripcion: form.descripcion
        };
        if (editandoId) {
            setClases(prev => prev.map(c => c.id === editandoId ? { ...c, ...datos } : c));
            mostrarToast("✅ Clase actualizada correctamente.");
        } else {
            setClases(prev => [...prev, { id: siguienteId, ...datos }]);
            setSiguienteId(p => p + 1);
            mostrarToast("✅ Clase registrada correctamente.");
        }
        setModalAbierto(false);
    }

    function eliminar() {
        setClases(prev => prev.filter(c => c.id !== eliminarId));
        setEliminarId(null);
        mostrarToast("🗑️ Clase eliminada.");
    }

    const claseEliminar = clases.find(c => c.id === eliminarId);
    const claseDetalle = clases.find(c => c.id === detalleId);

    return (
        <>
            <Header />
            <main className="contenido-principal">

                <div className="cabecera-pagina">
                    <div>
                        <h1 className="titulo-pagina">Gestión de Clases</h1>
                        <p className="subtitulo-pagina">Administra las clases disponibles en FitZone</p>
                    </div>
                    <button className="boton-nuevo" onClick={abrirNuevo}>
                        <i className="fas fa-plus"></i> Nueva Clase
                    </button>
                </div>

                <div className="fila-estadisticas">
                    {stats.map(s => <StatCard key={s.etiqueta} icono={s.icono} numero={s.numero} etiqueta={s.etiqueta} />)}
                </div>

                <div className="contenedor-tabla">
                    <div className="barra-busqueda">
                        <input
                            type="text"
                            placeholder="Buscar clase..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="input-busqueda"
                        />
                    </div>

                    <DataTable
                        columns={columnas}
                        data={clasesFiltradas}
                        customStyles={estilosTabla}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 20]}
                        paginationComponentOptions={{ rowsPerPageText: "Filas por página:", rangeSeparatorText: "de" }}
                        noDataComponent={<div style={{ padding: "24px", color: "#aaa" }}>No se encontraron resultados</div>}
                        onRowClicked={row => setDetalleId(row.id)}
                        highlightOnHover
                        pointerOnHover
                    />
                </div>

            </main>

            {/* Modal Nuevo/Editar */}
            {modalAbierto && (
                <div className="fondo-modal activo" onClick={e => { if (e.target.classList.contains("fondo-modal")) setModalAbierto(false); }}>
                    <div className="ventana-modal">
                        <div className="cabecera-modal">
                            <h2><i className={`fas ${editandoId ? "fa-edit" : "fa-plus-circle"}`}></i> {editandoId ? "Editar Clase" : "Nueva Clase"}</h2>
                            <button className="cerrar-modal" onClick={() => setModalAbierto(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="cuerpo-modal">
                            <div className="cuadricula-formulario">

                                <div className="grupo-campo">
                                    <label>Nombre de la clase <span className="obligatorio">*</span></label>
                                    <select value={form.clase} onChange={e => setForm(p => ({ ...p, clase: e.target.value }))}>
                                        <option value="">-- Selecciona --</option>
                                        {CLASES_OPCIONES.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>

                                {form.clase === "Otra" && (
                                    <div className="grupo-campo">
                                        <label>Nombre personalizado <span className="obligatorio">*</span></label>
                                        <input type="text" placeholder="Ej. Kickboxing"
                                            value={form.clasePersonalizada}
                                            onChange={e => setForm(p => ({ ...p, clasePersonalizada: e.target.value }))} />
                                    </div>
                                )}

                                {/* --- CAMBIO: Input a Select para Instructor --- */}
                                <div className="grupo-campo">
                                    <label>Instructor <span className="obligatorio">*</span></label>
                                    <select value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))}>
                                        <option value="">-- Selecciona un instructor --</option>
                                        {INSTRUCTORES_OPCIONES.map(instructor => (
                                            <option key={instructor} value={instructor}>{instructor}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grupo-campo">
                                    <label>Hora de inicio <span className="obligatorio">*</span></label>
                                    <input type="time" value={form.horaInicio}
                                        onChange={e => setForm(p => ({ ...p, horaInicio: e.target.value }))} />
                                </div>

                                <div className="grupo-campo">
                                    <label>Hora de fin <span className="obligatorio">*</span></label>
                                    <input type="time" value={form.horaFin}
                                        onChange={e => setForm(p => ({ ...p, horaFin: e.target.value }))} />
                                </div>

                                <div className="grupo-campo campo-completo">
                                    <label>Días <span className="obligatorio">*</span></label>
                                    <div className="selector-dias">
                                        {DIAS.map(dia => (
                                            <label key={dia} className={`dia-opcion ${form.dias.includes(dia) ? "seleccionado" : ""}`}>
                                                <input type="checkbox" checked={form.dias.includes(dia)} onChange={() => toggleDia(dia)} />
                                                {dia}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grupo-campo">
                                    <label>Cupos <span className="obligatorio">*</span></label>
                                    <input type="number" min="1" placeholder="Ej. 15"
                                        value={form.cupos}
                                        onChange={e => setForm(p => ({ ...p, cupos: e.target.value }))} />
                                </div>

                                <div className="grupo-campo">
                                    <label>Estado</label>
                                    <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
                                        <option value="Activa">Activa</option>
                                        <option value="Inactiva">Inactiva</option>
                                    </select>
                                </div>

                                <div className="grupo-campo campo-completo">
                                    <label>Descripción</label>
                                    <textarea placeholder="Descripción opcional..."
                                        value={form.descripcion}
                                        onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} />
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

            {/* Modal Eliminar */}
            <ModalConfirmar
                visible={!!eliminarId}
                nombre={claseEliminar ? `${claseEliminar.clase} – ${claseEliminar.instructor}` : ""}
                onConfirmar={eliminar}
                onCancelar={() => setEliminarId(null)}
            />

            {/* Modal Detalle */}
            {detalleId && claseDetalle && (
                <div className="fondo-modal activo" onClick={e => { if (e.target.classList.contains("fondo-modal")) setDetalleId(null); }}>
                    <div className="ventana-modal ventana-pequena">
                        <div className="cabecera-modal">
                            <h2><i className="fas fa-chalkboard-teacher"></i> {claseDetalle.clase}</h2>
                            <button className="cerrar-modal" onClick={() => setDetalleId(null)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="cuerpo-detalle">
                            {[
                                { label: "Instructor", valor: claseDetalle.instructor },
                                { label: "Horario", valor: `${formatHora(claseDetalle.horaInicio)} – ${formatHora(claseDetalle.horaFin)}` },
                                { label: "Días", valor: claseDetalle.dias.join(", ") },
                                { label: "Cupos", valor: `${claseDetalle.cupos} cupos` },
                                { label: "Estado", valor: claseDetalle.estado },
                                { label: "Descripción", valor: claseDetalle.descripcion || "—" },
                            ].map(d => (
                                <div className="fila-detalle" key={d.label}>
                                    <span className="etiqueta-detalle">{d.label}</span>
                                    <span className="valor-detalle">{d.valor}</span>
                                </div>
                            ))}
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

            {toast.visible && <div className="toast toast-exito visible">{toast.msg}</div>}
            <Footer />
        </>
    );
}