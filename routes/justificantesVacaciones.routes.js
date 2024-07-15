import express from 'express'

import { obtenerUsuarios, obtenerEmpresas, obtenerSucursales, obtenerDepartamentos, obtenerEstatus, obtenerMotivos, obtenerTipoSolicitudes, obtenerDetalleVacacionesDiasEconomicos, obtenerDetalleEmpleadoYJefeDirecto, solicitarAusenciasYRetardos, solicitarVacaciones, solicitarDiasEconomicos, obtenerSolicitudesPorEmpleado, obtenerSolicitudPorFolio, actualizarAutorizaciones, finalizarSolicitudAusenciasYRetardos, finalizarSolicitudVacaciones, finalizarSolicitudDiasEconomicos, obtenerDetalleUsuario, obtenerTodasSolicitudes, obtenerDepartamentosSucursales } from '../controllers/justificantesVacacionesController.js'

const router = express.Router()

router.get('/obtenerUsuarios', obtenerUsuarios)
router.get('/obtenerEmpresas', obtenerEmpresas)
router.get('/obtenerSucursales', obtenerSucursales)
router.get('/obtenerDepartamentos', obtenerDepartamentos)
router.get('/obtenerDepartamentosSucursales', obtenerDepartamentosSucursales)
router.get('/obtenerEstatus', obtenerEstatus)
router.get('/obtenerMotivos', obtenerMotivos)
router.get('/obtenerTipoSolicitudes', obtenerTipoSolicitudes)
router.get('/obtenerDetalleVacacionesDiasEconomicos/:numero_empleado', obtenerDetalleVacacionesDiasEconomicos)
router.get('/obtenerDetalleEmpleadoYJefeDirecto/:numero_empleado', obtenerDetalleEmpleadoYJefeDirecto)
router.get('/obtenerSolicitudesPorEmpleado/:numero_empleado', obtenerSolicitudesPorEmpleado)
router.get('/obtenerTodasSolicitudes', obtenerTodasSolicitudes)
router.get('/obtenerSolicitudPorFolio/:folio', obtenerSolicitudPorFolio)
router.get('/obtenerDetalleUsuario/:numero_empleado', obtenerDetalleUsuario)


router.post('/solicitarAusenciasYRetardos', solicitarAusenciasYRetardos)
router.post('/solicitarVacaciones', solicitarVacaciones)
router.post('/solicitarDiasEconomicos', solicitarDiasEconomicos)
router.post('/actualizarAutorizaciones', actualizarAutorizaciones)
router.post('/finalizarSolicitudAusenciasYRetardos/:folio', finalizarSolicitudAusenciasYRetardos)
router.post('/finalizarSolicitudVacaciones/:folio', finalizarSolicitudVacaciones)
router.post('/finalizarSolicitudDiasEconomicos/:folio', finalizarSolicitudDiasEconomicos)

export default router