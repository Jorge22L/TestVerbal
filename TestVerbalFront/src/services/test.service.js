import * as repo from "../repositories/test.repository.js";

export function obtenerEvaluados() {
    return repo.obtenerEvaluados();
}

export function obtenerPreguntas() {
    return repo.obtenerPreguntas();
}

export function crearAplicacion(evaluadoId, testId) {
    return repo.crearAplicacion(evaluadoId, testId);
}

export function guardarRespuesta(data) {
    return repo.guardarRespuesta(data);
}

export function finalizarAplicacion(aplicacionId) {
    return repo.finalizarAplicacion(aplicacionId);
}

export function obtenerResumen() {
    return repo.obtenerResumen();
}