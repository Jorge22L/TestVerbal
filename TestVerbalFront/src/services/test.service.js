import * as repo from "../repositories/test.repository.js";

export function obtenerEvaluados() {
    return repo.obtenerEvaluados();
}

export function obtenerPreguntas() {
    return repo.obtenerPreguntas();
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

export async function crearAplicacion(evaluadoId, testId, codigoAcceso) {
    if (!evaluadoId) throw new Error("Debe seleccionar un evaluado");
    if (!codigoAcceso) throw new Error("Debe ingresar el código de acceso");

    const valido = await repo.validarEvaluado(evaluadoId, codigoAcceso);

    if (!valido) {
        throw new Error("Código de acceso incorrecto");
    }

    return repo.crearAplicacion(evaluadoId, testId || 1);
}

export const obtenerTest = (id) => repo.obtenerTest(id);