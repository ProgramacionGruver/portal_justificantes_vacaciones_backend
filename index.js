import express from 'express'
import cors from 'cors'
import db from './config/db.js'
import cron from 'node-cron'
import justificantesVacacionesRoutes from './routes/justificantesVacaciones.routes.js'
import { obtenerUsuariosContpaq } from './helpers/obtenerUsuariosContpaq.js'
import { manejoRutinaObtenerTurnoDiario } from './helpers/manejoRutinas.js'
import { menejoRutinaObtenerTurnoEmpleado } from './helpers/manejoRutinas.js'

const app = express()
const port = 4040


app.use( express.json( { extended: true } ) )

db.authenticate()
db.sync()

app.use( cors() )

cron.schedule('30 22 * * *', async() => {
    await obtenerUsuariosContpaq()
})

cron.schedule('00 23 * * *', async() => {
    await menejoRutinaObtenerTurnoEmpleado()
})

cron.schedule('30 23 * * *', async() => {
    await manejoRutinaObtenerTurnoDiario()
})

app.use('/justificantesVacaciones/api', justificantesVacacionesRoutes)

app.listen( port, () => console.log(`El servidor está funcionando en el puerto ${ port }`) )
