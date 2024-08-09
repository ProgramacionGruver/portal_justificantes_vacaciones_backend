import express from 'express'
import { obtenerChecks, obtenerFaltas, obtenerFaltasContpaq } from '../controllers/checksController.js'

const router = express.Router()

router.post('/obtener/asistencias', obtenerChecks)
router.post('/obtener/faltas', obtenerFaltas)
router.post('/obtener/faltasContpaq', obtenerFaltasContpaq)

export default router