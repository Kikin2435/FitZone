import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Instalaciones.css";

// Importa tus imágenes desde assets
import maquinas from "../assets/imgs/instalaciones_maquinas.jpg";
import pesas from "../assets/imgs/instalaciones_pesas.jpg";
import cardio from "../assets/imgs/instalaciones_cardio.jpg";
import funcional from "../assets/imgs/instalaciones_funcional.jpg";
import spinning from "../assets/imgs/instalaciones_spinning.jpg";
import yoga from "../assets/imgs/instalaciones_yoga.jpg";
import grupales from "../assets/imgs/instalaciones_grupales.jpg";
import box from "../assets/imgs/instalaciones_box.jpg";
import recepcion from "../assets/imgs/instalaciones_recepcion.jpg";
import descanso from "../assets/imgs/instalaciones_descanso.jpg";

const items = [
    { img: maquinas, label: "Área de Máquinas" },
    { img: pesas, label: "Área de Pesas" },
    { img: cardio, label: "Área de Cardio" },
    { img: funcional, label: "Área Funcional" },
    { img: spinning, label: "Área de Spinning" },
    { img: yoga, label: "Área de Estiramiento y Yoga" },
    { img: grupales, label: "Área de Clases Grupales" },
    { img: box, label: "Zona de Box" },
    { img: recepcion, label: "Recepción" },
    { img: descanso, label: "Zona de Descanso" },
];

export default function Instalaciones() {
    return (
        <>
            <Header />
            <section className="instalaciones">
                <h1>Nuestras Instalaciones</h1>
                <p className="subtitulo">Espacios diseñados para llevar tu entrenamiento al siguiente nivel.</p>

                <div className="galeria">
                    {items.map((item) => (
                        <div className="item" key={item.label}>
                            <img src={item.img} alt={item.label} />
                            <div className="overlay">{item.label}</div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    );
}