import express from 'express'

import { obtenerUsuarios, obtenerEmpresas, obtenerSucursales, obtenerDepartamentos, obtenerEstatus, obtenerMotivos, obtenerTipoSolicitudes, obtenerDetalleVacacionesDiasEconomicos, obtenerDetalleEmpleadoYJefeDirecto, solicitarAusenciasYRetardos, solicitarVacaciones, solicitarDiasEconomicos, obtenerSolicitudesPorEmpleado } from '../controllers/justificantesVacacionesController.js'

const router = express.Router()

router.get('/obtenerUsuarios', obtenerUsuarios)
router.get('/obtenerEmpresas', obtenerEmpresas)
router.get('/obtenerSucursales', obtenerSucursales)
router.get('/obtenerDepartamentos', obtenerDepartamentos)
router.get('/obtenerEstatus', obtenerEstatus)
router.get('/obtenerMotivos', obtenerMotivos)
router.get('/obtenerTipoSolicitudes', obtenerTipoSolicitudes)
router.get('/obtenerDetalleVacacionesDiasEconomicos/:id', obtenerDetalleVacacionesDiasEconomicos)
router.get('/obtenerDetalleEmpleadoYJefeDirecto/:id', obtenerDetalleEmpleadoYJefeDirecto)
router.get('/obtenerSolicitudesPorEmpleado/:id', obtenerSolicitudesPorEmpleado)

router.post('/solicitarAusenciasYRetardos', solicitarAusenciasYRetardos)
router.post('/solicitarVacaciones', solicitarVacaciones)
router.post('/solicitarDiasEconomicos', solicitarDiasEconomicos)

export default router