import express from 'express'
import cors from 'cors'
import db from './config/db.js'

import justificantesVacacionesRoutes from './routes/justificantesVacaciones.routes.js'

const app = express()
const port = 4040


app.use( express.json( { extended: true } ) )

db.authenticate()
db.sync()

app.use( cors() )

app.use('/justificantesVacaciones/api', justificantesVacacionesRoutes)

app.listen( port, () => console.log(`El servidor está funcionando en el puerto ${ port }`) )
