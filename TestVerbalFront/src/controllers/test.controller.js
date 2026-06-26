import * as testService from "../services/test.service.js";

export async function obtenerEvaluados(req, res) {
    try {
        res.json(await testService.obtenerEvaluados());
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function obtenerPreguntas(req, res) {
    try {
        res.json(await testService.obtenerPreguntas());
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function crearAplicacion(req, res) {
    try {
        const { evaluadoId, testId } = req.body;
        const aplicacionId = await testService.crearAplicacion(evaluadoId, testId);
        res.status(201).json({ aplicacionId });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function guardarRespuesta(req, res) {
    try {
        await testService.guardarRespuesta(req.body);
        res.status(201).json({ mensaje: "Respuesta guardada" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function finalizarAplicacion(req, res) {
    try {
        const resultado = await testService.finalizarAplicacion(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function obtenerResumen(req, res) {
    try {
        res.json(await testService.obtenerResumen());
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}