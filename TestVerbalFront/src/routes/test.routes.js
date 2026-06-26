import { Router } from "express";
import {
    obtenerEvaluados,
    obtenerPreguntas,
    crearAplicacion,
    guardarRespuesta,
    finalizarAplicacion,
    obtenerResumen
} from "../controllers/test.controller.js";

const router = Router();

router.get("/evaluados", obtenerEvaluados);
router.get("/preguntas", obtenerPreguntas);
router.post("/aplicaciones", crearAplicacion);
router.post("/respuestas", guardarRespuesta);
router.post("/aplicaciones/:id/finalizar", finalizarAplicacion);
router.get("/resumen", obtenerResumen);

export default router;