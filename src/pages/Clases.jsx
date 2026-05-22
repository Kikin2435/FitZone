import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Clases.css";

const clases = [
    { icono: "fas fa-bicycle", nombre: "Spinning", instructor: "Laura Méndez", horario: "7:00 AM - 8:00 AM", cupos: 8 },
    { icono: "fas fa-dumbbell", nombre: "Crossfit", instructor: "Carlos Vega", horario: "6:00 PM - 7:00 PM", cupos: 5 },
    { icono: "fas fa-spa", nombre: "Yoga", instructor: "Sofía Ruiz", horario: "8:00 PM - 9:00 PM", cupos: 12 },
    { icono: "fas fa-running", nombre: "Funcional", instructor: "Diego Torres", horario: "5:00 PM - 6:00 PM", cupos: 6 },
];

export default function Clases() {
    return (
        <>
            <Header />

            <section className="clases">
                <h1>Reserva tu Clase</h1>
                <p className="subtitulo">Elige tu entrenamiento favorito y asegura tu lugar.</p>

                <div className="grid-clases">
                    {clases.map((clase) => (
                        <div className="card" key={clase.nombre}>
                            <i className={clase.icono}></i>
                            <div className="card-content">
                                <h2>{clase.nombre}</h2>
                                <p><strong>Instructor:</strong> {clase.instructor}</p>
                                <p><strong>Horario:</strong> {clase.horario}</p>
                                <p><strong>Cupos:</strong> {clase.cupos} disponibles</p>
                                <button>Reservar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </>
    );
}