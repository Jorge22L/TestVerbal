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
        (evaluado_id, test_id, fechaInicio, estado)
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
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const totalPreguntasResult = await client.query(`
            SELECT COUNT(*)::int AS total
            FROM preguntaverbal
            WHERE activo = true
        `);

        const respondidasResult = await client.query(`
            SELECT COUNT(*)::int AS total
            FROM respuestaverbal
            WHERE aplicacion_id = $1
        `, [aplicacionId]);

        const correctasResult = await client.query(`
            SELECT COUNT(*)::int AS total
            FROM respuestaverbal rv
            INNER JOIN opcionverbal ov 
                ON ov.id = rv.opcionseleccionada_id
            WHERE rv.aplicacion_id = $1
            AND ov.correcta = true
        `, [aplicacionId]);

        const totalPreguntas = totalPreguntasResult.rows[0].total;
        const respondidas = respondidasResult.rows[0].total;
        const correctas = correctasResult.rows[0].total;

        const incorrectas = respondidas - correctas;
        const omitidas = totalPreguntas - respondidas;

        await client.query(`
            UPDATE aplicaciontest
            SET fechafinal = NOW(), estado = 'CORREGIDA'
            WHERE id = $1
        `, [aplicacionId]);

        await client.query(`
            DELETE FROM resultadotest
            WHERE aplicacion_id = $1
        `, [aplicacionId]);

        await client.query(`
            INSERT INTO resultadotest
            (aplicacion_id, aciertos, errores, omitidas, puntajedirecto)
            VALUES ($1, $2, $3, $4, $2)
        `, [aplicacionId, correctas, incorrectas, omitidas]);

        await client.query("COMMIT");

        return {
            correctas,
            incorrectas,
            omitidas,
            puntajeDirecto: correctas
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
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

export async function validarEvaluado(evaluadoId, codigoAcceso) {
    const { rows } = await pool.query(`
        SELECT id
        FROM evaluado
        WHERE id = $1
        AND codigoacceso = $2
    `, [evaluadoId, codigoAcceso]);

    return rows.length > 0;
}

export async function obtenerTest(id) {
    const { rows } = await pool.query(`
        SELECT id, nombre, tiempominutos
        FROM testcomprensionverbal
        WHERE id = $1
    `, [id]);

    return rows[0];
}