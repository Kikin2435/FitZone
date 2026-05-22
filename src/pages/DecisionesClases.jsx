import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./DecisionesClases.css";

const datosClasesPorMes = [
    { mes: "Ene", Spinning: 10, Crossfit: 6, Yoga: 8, Funcional: 5, Zumba: 3 },
    { mes: "Feb", Spinning: 12, Crossfit: 8, Yoga: 10, Funcional: 6, Zumba: 4 },
    { mes: "Mar", Spinning: 15, Crossfit: 9, Yoga: 13, Funcional: 8, Zumba: 6 },
    { mes: "Abr", Spinning: 11, Crossfit: 7, Yoga: 9, Funcional: 5, Zumba: 4 },
    { mes: "May", Spinning: 18, Crossfit: 12, Yoga: 14, Funcional: 9, Zumba: 7 },
    { mes: "Jun", Spinning: 16, Crossfit: 10, Yoga: 12, Funcional: 8, Zumba: 6 },
    { mes: "Jul", Spinning: 13, Crossfit: 8, Yoga: 11, Funcional: 6, Zumba: 5 },
    { mes: "Ago", Spinning: 20, Crossfit: 14, Yoga: 16, Funcional: 10, Zumba: 8 },
    { mes: "Sep", Spinning: 17, Crossfit: 11, Yoga: 13, Funcional: 8, Zumba: 6 },
    { mes: "Oct", Spinning: 14, Crossfit: 9, Yoga: 11, Funcional: 7, Zumba: 5 },
    { mes: "Nov", Spinning: 15, Crossfit: 10, Yoga: 12, Funcional: 8, Zumba: 6 },
    { mes: "Dic", Spinning: 9, Crossfit: 6, Yoga: 8, Funcional: 5, Zumba: 3 },
];

const CLASES = ["Spinning", "Crossfit", "Yoga", "Funcional", "Zumba"];
const COLORES = {
    Spinning: "#E10600",
    Crossfit: "#3B82F6",
    Yoga: "#10B981",
    Funcional: "#F59E0B",
    Zumba: "#8B5CF6",
};

const datosConTotal = datosClasesPorMes.map(d => ({
    ...d,
    Total: CLASES.reduce((a, c) => a + d[c], 0),
}));

const estilosTabla = {
    table: { style: { backgroundColor: "transparent" } },
    headRow: { style: { backgroundColor: "#111", borderBottom: "2px solid #E10600" } },
    headCells: { style: { color: "#AAAAAA", fontFamily: "Montserrat, sans-serif", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "12px 10px" } },
    rows: { style: { backgroundColor: "#1A1A1A", borderBottom: "1px solid #222" }, highlightOnHoverStyle: { backgroundColor: "#202020", borderLeft: "3px solid #E10600" } },
    cells: { style: { color: "#F5F5F5", fontSize: "13px", padding: "10px 10px" } },
    pagination: { style: { backgroundColor: "#1A1A1A", color: "#AAAAAA", borderTop: "1px solid #222" } },
    noData: { style: { backgroundColor: "#1A1A1A", color: "#AAAAAA", padding: "24px" } },
};

export default function DecisionesClases() {
    const [busqueda, setBusqueda] = useState("");

    const maxTotal = Math.max(...datosConTotal.map(d => d.Total));

    const tablaFiltrada = useMemo(() =>
        datosConTotal.filter(d =>
            d.mes.toLowerCase().includes(busqueda.toLowerCase())
        ), [busqueda]);

    const columnas = [
        {
            name: "Mes",
            selector: r => r.mes,
            sortable: true,
            width: "80px",
            cell: r => <strong style={{ color: "#F5F5F5", fontFamily: "Montserrat, sans-serif" }}>{r.mes}</strong>
        },
        ...CLASES.map(clase => ({
            name: clase,
            selector: r => r[clase],
            sortable: true,
            cell: r => <span style={{ color: COLORES[clase], fontWeight: 700 }}>{r[clase]}</span>
        })),
        {
            name: "Total",
            selector: r => r.Total,
            sortable: true,
            cell: r => (
                <span className={`total-badge ${r.Total === maxTotal ? "total-max" : ""}`}>
                    {r.Total}{r.Total === maxTotal && " 🏆"}
                </span>
            )
        },
    ];

    return (
        <>
            <Header />
            <main className="contenido-principal">

                <div className="cabecera-pagina">
                    <div>
                        <h1 className="titulo-pagina">Análisis de Clases</h1>
                        <p className="subtitulo-pagina">Sesiones impartidas por clase y mes para optimizar horarios</p>
                    </div>
                </div>

                <div className="contenedor-tabla">
                    <h2 className="titulo-seccion" style={{ marginBottom: "6px" }}>
                        <i className="fas fa-table"></i> Clases por Mes
                    </h2>
                    <p className="subtitulo-seccion">
                        Número de sesiones por tipo de clase en cada mes del año
                    </p>

                    <div className="barra-filtros">
                        <input
                            type="text"
                            placeholder="Buscar mes..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="input-busqueda"
                        />
                    </div>

                    <DataTable
                        columns={columnas}
                        data={tablaFiltrada}
                        customStyles={estilosTabla}
                        pagination
                        paginationPerPage={6}
                        paginationRowsPerPageOptions={[6, 12]}
                        paginationComponentOptions={{ rowsPerPageText: "Filas por página:", rangeSeparatorText: "de" }}
                        noDataComponent={<div style={{ padding: "24px", color: "#aaa" }}>No se encontraron resultados</div>}
                        highlightOnHover
                    />
                </div>

            </main>
            <Footer />
        </>
    );
}