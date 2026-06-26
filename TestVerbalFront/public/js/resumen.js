const resumenCards = document.getElementById("resumenCards");

async function cargarResumen() {
    const response = await fetch("/api/resumen");
    const resumen = await response.json();

    resumenCards.innerHTML = "";

    for (const r of resumen) {
        const nombre = [
            r.primer_nombre,
            r.segundo_nombre,
            r.primer_apellido,
            r.segundo_apellido
        ].filter(Boolean).join(" ");

        const total = Number(r.aciertos) + Number(r.errores) + Number(r.omitidas);
        const porcentaje = total > 0 ? Math.round((Number(r.aciertos) / total) * 100) : 0;

        const card = document.createElement("article");
        card.className = "resultado-card";

        card.innerHTML = `
            <h3>${nombre}</h3>
            <p><strong>Estado:</strong> ${r.estado}</p>
            <p><strong>Aciertos:</strong> ${r.aciertos}</p>
            <p><strong>Errores:</strong> ${r.errores}</p>
            <p><strong>Omitidas:</strong> ${r.omitidas}</p>
            <p><strong>Puntaje CV:</strong> ${r.puntajedirecto}</p>

            <div class="progress">
                <div class="progress-bar" style="width:${porcentaje}%"></div>
            </div>
            <p>${porcentaje}% de aciertos</p>
        `;

        resumenCards.appendChild(card);
    }
}

cargarResumen();