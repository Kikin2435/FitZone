import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import fondoMenu from "../assets/imgs/menu_fondo.jfif";
import "./Menu.css";

export default function Menu() {
    return (
        <>
            <Header />

            <section
                className="hero"
                style={{
                    background: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)) center/cover no-repeat, url(${fondoMenu}) center/cover no-repeat`,
                }}
            >
                <div className="hero-content">
                    <h1>Transforma tu cuerpo,<br /> transforma tu vida</h1>
                    <p>Entrena con los mejores profesionales y alcanza tus metas más rápido.</p>
                    <div className="hero-stats">
                        <div className="stat">
                            <i className="fas fa-calendar-check"></i>
                            <span className="stat-number">+120</span>
                            <span className="stat-label">Clases al mes</span>
                        </div>
                        <div className="stat">
                            <i className="fas fa-dumbbell"></i>
                            <span className="stat-number">8</span>
                            <span className="stat-label">Áreas de entrenamiento</span>
                        </div>
                        <div className="stat">
                            <i className="fas fa-star"></i>
                            <span className="stat-number">4,8★</span>
                            <span className="stat-label">Calificación promedio</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="beneficios">
                <h2>¿Por qué elegir FitZone?</h2>
                <div className="cards">
                    <div className="card">
                        <i className="fas fa-user-tie"></i>
                        <h3>Entrenadores Certificados</h3>
                        <p>Profesionales listos para guiarte en cada etapa de tu entrenamiento.</p>
                    </div>
                    <div className="card">
                        <i className="fas fa-clipboard-list"></i>
                        <h3>Planes Personalizados</h3>
                        <p>Rutinas diseñadas específicamente para tus objetivos físicos.</p>
                    </div>
                    <div className="card">
                        <i className="fas fa-chart-line"></i>
                        <h3>Seguimiento de Progreso</h3>
                        <p>Monitorea tu evolución con métricas claras y precisas.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}