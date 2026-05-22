import { useEffect, useState } from "react";

export default function Toast({ mensaje, tipo, visible }) {
    if (!visible) return null;
    return (
        <div className={`toast toast-${tipo} visible`}>{mensaje}</div>
    );
}