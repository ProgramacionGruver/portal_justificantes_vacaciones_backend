import express from 'express'
import cors from 'cors'
import db from './config/db.js'
import cron from 'node-cron'
import justificantesVacacionesRoutes from './routes/justificantesVacaciones.routes.js'
import checksRoutes from './routes/checks.routes.js'
import catalogoRoutes from './routes/catalogos.routes.js'
import diasGanadosRoutes from './routes/diasGanados.routes.js'
import { obtenerUsuariosContpaq, agregarPermisosUsuarios } from './helpers/obtenerUsuariosContpaq.js'
import { manejoRutinaObtenerTurnoDiario } from './helpers/manejoRutinas.js'
import { menejoRutinaObtenerTurnoEmpleado } from './helpers/manejoRutinas.js'

const app = express()
const port = 4022


app.use( express.json( { extended: true } ) )

db.authenticate()
db.sync()

app.use( cors() )

cron.schedule('30 22 * * *', async() => {
    await obtenerUsuariosContpaq()
})

cron.schedule('00 23 * * *', async() => {
    await menejoRutinaObtenerTurnoEmpleado()
    await agregarPermisosUsuarios()
})

cron.schedule('30 23 * * *', async() => {
    await manejoRutinaObtenerTurnoDiario()
})


app.use('/justificantesVacaciones/api', justificantesVacacionesRoutes)
app.use('/justificantesVacaciones/api', checksRoutes)
app.use('/justificantesVacaciones/api', catalogoRoutes)
app.use('/justificantesVacaciones/api', diasGanadosRoutes)

app.listen( port, () => console.log(`El servidor está funcionando en el puerto ${ port }`) )
