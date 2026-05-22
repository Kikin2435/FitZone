export default function StatCard({ icono, numero, etiqueta }) {
    return (
        <div className="tarjeta-estadistica">
            <i className={icono}></i>
            <div>
                <span className="numero-stat">{numero}</span>
                <span className="etiqueta-stat">{etiqueta}</span>
            </div>
        </div>
    );
}