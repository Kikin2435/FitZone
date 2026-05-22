import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Decisiones.css";

const datosMembresiasPorMes = [
    { mes: "Ene", Básico: 8, Premium: 6, Anual: 4 },
    { mes: "Feb", Básico: 10, Premium: 9, Anual: 5 },
    { mes: "Mar", Básico: 14, Premium: 11, Anual: 6 },
    { mes: "Abr", Básico: 9, Premium: 8, Anual: 5 },
    { mes: "May", Básico: 18, Premium: 14, Anual: 8 },
    { mes: "Jun", Básico: 15, Premium: 13, Anual: 7 },
    { mes: "Jul", Básico: 12, Premium: 10, Anual: 6 },
    { mes: "Ago", Básico: 20, Premium: 16, Anual: 9 },
    { mes: "Sep", Básico: 16, Premium: 14, Anual: 8 },
    { mes: "Oct", Básico: 12, Premium: 10, Anual: 7 },
    { mes: "Nov", Básico: 14, Premium: 12, Anual: 7 },
    { mes: "Dic", Básico: 8, Premium: 7, Anual: 5 },
];

const COLORES = {
    Básico: "#CD7F32",
    Premium: "#C0C0C0",
    Anual: "#D4AF37",
};

function TooltipMembresias({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((a, b) => a + b.value, 0);
    return (
        <div className="tooltip-grafica">
            <p className="tooltip-mes">{label}</p>
            {payload.map(p => (
                <p key={p.name} style={{ color: p.fill, margin: "3px 0", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
            <p style={{ color: "#F5F5F5", marginTop: "6px", borderTop: "1px solid #333", paddingTop: "6px", fontSize: "13px", fontFamily: "Montserrat, sans-serif" }}>
                Total: <strong>{total}</strong>
            </p>
        </div>
    );
}

export default function Decisiones() {
    return (
        <>
            <Header />
            <main className="contenido-principal">

                <div className="cabecera-pagina">
                    <div>
                        <h1 className="titulo-pagina">Toma de Decisiones</h1>
                        <p className="subtitulo-pagina">Analiza el comportamiento de usuarios y membresías por mes</p>
                    </div>
                </div>

                {/* Gráfica 1 — membresías agrupadas */}
                <div className="contenedor-grafica">
                    <h2 className="titulo-seccion">
                        <i className="fas fa-chart-bar"></i> Membresías Vendidas por Mes
                    </h2>
                    <p className="subtitulo-seccion">
                        Compara Básico, Premium y Anual mes a mes para saber qué plan impulsar
                    </p>
                    <div className="grafica-wrapper">
                        <ResponsiveContainer width="100%" height={340}>
                            <BarChart
                                data={datosMembresiasPorMes}
                                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                barCategoryGap="25%"
                                barGap={4}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis
                                    dataKey="mes"
                                    tick={{ fill: "#AAAAAA", fontSize: 13, fontFamily: "Montserrat, sans-serif" }}
                                    axisLine={{ stroke: "#222" }}
                                    tickLine={false}
                                />
                                <YAxis tick={{ fill: "#AAAAAA", fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<TooltipMembresias />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                                <Legend
                                    wrapperStyle={{ paddingTop: "20px", fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}
                                    formatter={(value) => <span style={{ color: COLORES[value] }}>{value}</span>}
                                />
                                <Bar dataKey="Básico" fill={COLORES.Básico} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Premium" fill={COLORES.Premium} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Anual" fill={COLORES.Anual} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </main>
            <Footer />
        </>
    );
}