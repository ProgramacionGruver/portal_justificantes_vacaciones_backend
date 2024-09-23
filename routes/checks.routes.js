import express from 'express'
import { actualizarDiasFeriados, agregarDiasFeriados, eliminarDiasFeriados, obtenerChecks, obtenerDiasFeriados, obtenerFaltas, obtenerFaltasContpaq } from '../controllers/checksController.js'

const router = express.Router()

router.post('/obtener/asistencias', obtenerChecks)
router.post('/obtener/faltas', obtenerFaltas)
router.post('/obtener/faltasContpaq', obtenerFaltasContpaq)

router.get('/diasFeriados', obtenerDiasFeriados)
router.post('/diasFeriados', agregarDiasFeriados)
router.put('/diasFeriados/:idDiaFeriado', actualizarDiasFeriados)
router.delete('/diasFeriados/:idDiaFeriado', eliminarDiasFeriados)

export default router