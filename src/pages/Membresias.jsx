import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Membresias.css";

export default function Membresias() {
    const planes = [
        {
            nombre: "Básico",
            precio: "$499",
            periodo: "mes",
            beneficios: ["Acceso al gimnasio", "Área de pesas", "Horario limitado"],
            borde: "#CD7F32",
        },
        {
            nombre: "Premium",
            precio: "$799",
            periodo: "mes",
            beneficios: ["Acceso ilimitado", "Todas las clases incluidas", "Entrenador personalizado", "Seguimiento de progreso"],
            borde: "#C0C0C0",
            destacado: true,
        },
        {
            nombre: "Anual",
            precio: "$7,999",
            periodo: "año",
            beneficios: ["Acceso total", "Clases ilimitadas", "2 evaluaciones físicas", "Descuento en productos"],
            borde: "#D4AF37",
        },
    ];

    return (
        <>
            <Header />

            <section className="planes">
                <h1>Nuestras Membresías</h1>
                <p className="subtitulo">Elige el plan que mejor se adapte a tus objetivos.</p>

                <div className="contenedor-planes">
                    {planes.map((plan) => (
                        <div
                            key={plan.nombre}
                            className={`plan ${plan.destacado ? "destacado" : ""}`}
                            style={{ borderColor: plan.borde }}
                        >
                            <h2>{plan.nombre}</h2>
                            <div className="precio">
                                {plan.precio} <span>/ {plan.periodo}</span>
                            </div>
                            <ul>
                                {plan.beneficios.map((b) => (
                                    <li key={b}>{b}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </>
    );
}