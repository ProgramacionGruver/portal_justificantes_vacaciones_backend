import express from 'express'
import { agregarIncapacidades, obtenerIncapacidades } from '../controllers/incapacidadesController.js'

const router = express.Router()

router.get('/incapacidades', obtenerIncapacidades)
router.post('/incapacidades', agregarIncapacidades)

export default router