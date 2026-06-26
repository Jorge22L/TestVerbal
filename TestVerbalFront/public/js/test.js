const contenedor = document.getElementById("preguntas");
const contador = document.getElementById("contador");
const estado = document.getElementById("estado");
const btnFinalizar = document.getElementById("finalizar");

let totalPreguntas = 0;

async function cargarPreguntas() {
    const aplicacionId = localStorage.getItem("aplicacionId");

    if (!aplicacionId) {
        window.location.href = "index.html";
        return;
    }

    estado.textContent = "Cargando preguntas...";

    try {
        const response = await fetch("/api/preguntas");
        const preguntas = await response.json();

        totalPreguntas = preguntas.length;
        contador.textContent = `0/${totalPreguntas}`;
        contenedor.innerHTML = "";

        for (const pregunta of preguntas) {
            const div = document.createElement("div");
            div.className = "pregunta";

            div.innerHTML = `
                <h3>${pregunta.numero}. ${pregunta.enunciado}</h3>
                <p class="autor">${pregunta.autor ?? ""}</p>
                ${pregunta.opciones.map(opcion => `
                    <label class="opcion">
                        <input 
                            type="radio"
                            name="pregunta_${pregunta.id}"
                            value="${opcion.id}"
                            data-pregunta="${pregunta.id}">
                        ${opcion.letra}) ${opcion.texto}
                    </label>
                `).join("")}
            `;

            contenedor.appendChild(div);
        }

        estado.textContent = "";

    } catch (error) {
        estado.textContent = "Error cargando preguntas.";
    }
}

contenedor.addEventListener("change", async (event) => {
    if (event.target.type !== "radio") return;

    const aplicacionId = localStorage.getItem("aplicacionId");

    await fetch("/api/respuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            aplicacionId,
            preguntaId: event.target.dataset.pregunta,
            opcionId: event.target.value
        })
    });

    actualizarContador();
});

function actualizarContador() {
    const respondidas = new Set();

    document.querySelectorAll("input[type='radio']:checked").forEach(input => {
        respondidas.add(input.name);
    });

    contador.textContent = `${respondidas.size}/${totalPreguntas}`;
}

btnFinalizar.addEventListener("click", async () => {
    const aplicacionId = localStorage.getItem("aplicacionId");

    await fetch(`/api/aplicaciones/${aplicacionId}/finalizar`, {
        method: "POST"
    });

    localStorage.removeItem("aplicacionId");
    window.location.href = "resumen.html";
});

cargarPreguntas();