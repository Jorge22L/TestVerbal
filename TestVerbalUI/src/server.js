import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './db/pool.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = Number(process.env.PORT)

app.use(cors())
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(morgan("dev"))
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

// Evaluados
app.get('/api/evaluados', async(req, res) => {
    try{
        const { rows } = await pool.query(
            `
            SELECT * FROM evaluado 
            ORDER BY id DESC
            `
        )
        res.json(rows)
    }catch(error){
        res.status(500).json({ mensaje: error.message })
    }
})

app.listen(port, () => {
    console.log(`Servidor iniciado en https://localhost:${port}`)
    console.log(process.env.DB_NAME)
})