import express from 'express'
import cors from 'cors'
import db from './config/db.js'
import cron from 'node-cron'
import justificantesVacacionesRoutes from './routes/justificantesVacaciones.routes.js'
import checksRoutes from './routes/checks.routes.js'
import catalogoRoutes from './routes/catalogos.routes.js'
import diasGanadosRoutes from './routes/diasGanados.routes.js'
import incapacidadesRoutes from './routes/incapacidades.routes.js'
import { obtenerUsuariosContpaq, agregarPermisosUsuarios, agregarPermisosProrroga } from './helpers/obtenerUsuariosContpaq.js'
import { manejoRutinaObtenerTurnoDiario } from './helpers/manejoRutinas.js'
import { menejoRutinaObtenerTurnoEmpleado } from './helpers/manejoRutinas.js'
import { obtenerAutorizacionesPendientes, rechazarSolicitudesPendientes } from './controllers/justificantesVacacionesController.js'

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

cron.schedule('0 1 * * *', async() => {
    await agregarPermisosProrroga()
})

cron.schedule('30 1 2,17 * *', async () => {
    await obtenerAutorizacionesPendientes()
})

cron.schedule('30 1 3,18 * *', async () => {
    await rechazarSolicitudesPendientes()
})

app.use('/justificantesVacaciones/api', justificantesVacacionesRoutes)
app.use('/justificantesVacaciones/api', checksRoutes)
app.use('/justificantesVacaciones/api', catalogoRoutes)
app.use('/justificantesVacaciones/api', diasGanadosRoutes)
app.use('/justificantesVacaciones/api', incapacidadesRoutes)

app.listen( port, () => console.log(`El servidor está funcionando en el puerto ${ port }`) )
