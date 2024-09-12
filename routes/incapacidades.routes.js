import express from 'express'
import multer from 'multer'
import { storage } from '../helpers/multer.js'

import { actualizarEstatusIncapacidad, actualizarIncapacidades, agregarIncapacidades, obtenerIncapacidades } from '../controllers/incapacidadesController.js'

const router = express.Router()
const upload = multer({ storage })

router.post('/obtener/incapacidades', obtenerIncapacidades)
router.post('/agregar/incapacidades', upload.fields([
    { name: 'archivo', maxCount: 1 },
    { name: 'archivoSt7', maxCount: 1 },
    { name: 'archivoSt2', maxCount: 1 },
    { name: 'archivoSiaat', maxCount: 1 },
]), agregarIncapacidades)
router.post('/actualizar/incapacidades', upload.fields([
    { name: 'archivo', maxCount: 1 },
    { name: 'archivoSt7', maxCount: 1 },
    { name: 'archivoSt2', maxCount: 1 },
    { name: 'archivoSiaat', maxCount: 1 },
]), actualizarIncapacidades)
router.post('/actualizar/estatus/incapacidades', actualizarEstatusIncapacidad)

export default router