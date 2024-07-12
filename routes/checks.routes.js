import express from 'express'
import { obtenerChecks } from '../controllers/checksController.js'

const router = express.Router()

router.post('/obtener/asistencias', obtenerChecks)

export default router