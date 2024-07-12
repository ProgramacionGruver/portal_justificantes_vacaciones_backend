import express from 'express'
import { actualizarCatologoVacaciones, agregarCatologoVacaciones, eliminarCatologoVacaciones, obtenerCatologoUsuarios, obtenerCatologoVacaciones } from '../controllers/catalogosController.js'

const router = express.Router()

router.get('/catalogoVacaciones', obtenerCatologoVacaciones)
router.post('/catalogoVacaciones', agregarCatologoVacaciones)
router.put('/catalogoVacaciones/:idVacaciones', actualizarCatologoVacaciones)
router.delete('/catalogoVacaciones/:idVacaciones', eliminarCatologoVacaciones)

router.get('/catalogoUsuarios', obtenerCatologoUsuarios)


export default router