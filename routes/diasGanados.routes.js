import express from 'express'
import { agregarDiasGanados, obtenerDiasGanados } from '../controllers/diasGanadosController.js'

const router = express.Router()

router.get('/diasGanados', obtenerDiasGanados)
router.post('/diasGanados', agregarDiasGanados)

export default router