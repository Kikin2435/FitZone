export default function ModalConfirmar({ visible, nombre, onConfirmar, onCancelar }) {
    if (!visible) return null;

    return (
        <div className="fondo-modal visible" onClick={(e) => { if (e.target.classList.contains('fondo-modal')) onCancelar(); }}>
            <div className="ventana-modal ventana-pequena">
                <div className="cabecera-modal cabecera-peligro">
                    <h2><i className="fas fa-trash-alt"></i> Eliminar</h2>
                    <button className="cerrar-modal" onClick={onCancelar}><i className="fas fa-times"></i></button>
                </div>
                <div className="cuerpo-eliminar">
                    <p>¿Estás seguro de que deseas eliminar a:</p>
                    <p className="nombre-a-eliminar">{nombre}</p>
                    <p className="advertencia-eliminar">Esta acción no se puede deshacer.</p>
                </div>
                <div className="pie-modal">
                    <button className="boton-cancelar" onClick={onCancelar}>Cancelar</button>
                    <button className="boton-eliminar" onClick={onConfirmar}>
                        <i className="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}