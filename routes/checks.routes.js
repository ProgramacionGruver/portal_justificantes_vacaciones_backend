import express from 'express'
import { obtenerChecks, obtenerFaltas } from '../controllers/checksController.js'

const router = express.Router()

router.post('/obtener/asistencias', obtenerChecks)
router.post('/obtener/faltas', obtenerFaltas)

export default router