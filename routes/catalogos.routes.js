import express from 'express'
import { actualizarCatologoUsuarios, actualizarCatologoVacaciones, agregarCatalogoTurnos, agregarCatologoVacaciones, eliminarCatologoVacaciones, obtenerCatologoTurnos, obtenerCatologoUsuarios, obtenerCatologoVacaciones } from '../controllers/catalogosController.js'

const router = express.Router()

router.get('/catalogoVacaciones', obtenerCatologoVacaciones)
router.post('/catalogoVacaciones', agregarCatologoVacaciones)
router.put('/catalogoVacaciones/:idVacaciones', actualizarCatologoVacaciones)
router.delete('/catalogoVacaciones/:idVacaciones', eliminarCatologoVacaciones)

router.get('/catalogoUsuarios', obtenerCatologoUsuarios)
router.put('/catalogoUsuarios/:idUsuario', actualizarCatologoUsuarios)

router.get('/catalogoTurnos', obtenerCatologoTurnos)
router.post('/catalogoTurnos', agregarCatalogoTurnos)

export default router