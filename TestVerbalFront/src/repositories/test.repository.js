import pool from "../db/pool.js";

export async function obtenerEvaluados() {
    const { rows } = await pool.query(`
        SELECT id, primerNombre, segundoNombre, primerApellido, segundoApellido
        FROM evaluado
        ORDER BY id DESC
    `);

    return rows;
}

export async function obtenerPreguntas() {
    const { rows } = await pool.query(`
        SELECT 
            p.id AS pregunta_id,
            p.numero,
            p.enunciado,
            p.autor,
            o.id AS opcion_id,
            o.letra,
            o.texto
        FROM preguntaVerbal p
        JOIN opcionVerbal o ON o.pregunta_id = p.id
        WHERE p.activo = true
        ORDER BY p.numero, o.letra
    `);

    const preguntas = [];

    for (const row of rows) {
        let pregunta = preguntas.find(p => p.id === row.pregunta_id);

        if (!pregunta) {
            pregunta = {
                id: row.pregunta_id,
                numero: row.numero,
                enunciado: row.enunciado,
                autor: row.autor,
                opciones: []
            };
            preguntas.push(pregunta);
        }

        pregunta.opciones.push({
            id: row.opcion_id,
            letra: row.letra,
            texto: row.texto
        });
    }

    return preguntas;
}

export async function crearAplicacion(evaluadoId, testId) {
    const { rows } = await pool.query(`
        INSERT INTO aplicacionTest
        (evaluado_id, test_id, fecha_inicio, estado)
        VALUES ($1, $2, NOW(), 'EN_PROCESO')
        RETURNING id
    `, [evaluadoId, testId]);

    return rows[0].id;
}

export async function guardarRespuesta({ aplicacionId, preguntaId, opcionId }) {
    await pool.query(`
        INSERT INTO respuesta_verbal
        (aplicacion_id, pregunta_id, opcion_seleccionada_id, fecha_respuesta)
        VALUES ($1, $2, $3, NOW())
    `, [aplicacionId, preguntaId, opcionId]);
}

export async function finalizarAplicacion(aplicacionId) {
    const { rows } = await pool.query(`
        SELECT COUNT(*)::int AS aciertos
        FROM respuesta_verbal rv
        JOIN opcion_verbal ov ON ov.id = rv.opcion_seleccionada_id
        WHERE rv.aplicacion_id = $1
        AND ov.correcta = true
    `, [aplicacionId]);

    const aciertos = rows[0].aciertos;

    await pool.query(`
        UPDATE aplicacionTest
        SET fecha_final = NOW(), estado = 'CORREGIDA'
        WHERE id = $1
    `, [aplicacionId]);

    await pool.query(`
        INSERT INTO resultadoTest
        (aplicacion_id, aciertos, errores, omitidas, puntajeDirecto)
        VALUES ($1, $2, 0, 0, $2)
    `, [aplicacionId, aciertos]);

    return {
        aciertos,
        puntajeDirecto: aciertos
    };
}

export async function obtenerResumen() {
    const { rows } = await pool.query(`
        SELECT
            a.id AS aplicacion_id,
            e.primerNombre,
            e.primerApellido,
            a.estado,
            r.aciertos,
            r.puntajeDirecto
        FROM aplicacionTest a
        JOIN evaluado e ON e.id = a.evaluado_id
        LEFT JOIN resultadoTest r ON r.aplicacion_id = a.id
        ORDER BY a.id DESC
    `);

    return rows;
}