const selectEvaluado = document.getElementById("evaluado");
const btnIniciar = document.getElementById("iniciar");
const estado = document.getElementById("estado");

async function cargarEvaluados() {
    estado.textContent = "Cargando evaluados...";

    try {
        const response = await fetch("/api/evaluados");
        const evaluados = await response.json();

        selectEvaluado.innerHTML = "";

        for (const e of evaluados) {
            const nombre = [
                e.primernombre,
                e.segundonombre,
                e.primerapellido,
                e.segundoapellido
            ].filter(Boolean).join(" ");

            const option = document.createElement("option");
            option.value = e.id;
            option.textContent = nombre;
            selectEvaluado.appendChild(option);
        }

        estado.textContent = evaluados.length
            ? `${evaluados.length} evaluado(s) disponibles.`
            : "No hay evaluados registrados.";

    } catch (error) {
        estado.textContent = "Error cargando evaluados.";
    }
}

btnIniciar.addEventListener("click", async () => {
    const evaluadoId = selectEvaluado.value;

    if (!evaluadoId) {
        estado.textContent = "Seleccione un evaluado.";
        return;
    }

    const response = await fetch("/api/aplicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluadoId, testId: 1 })
    });

    const data = await response.json();

    localStorage.setItem("aplicacionId", data.aplicacionId);
    window.location.href = "test.html";
});

cargarEvaluados();