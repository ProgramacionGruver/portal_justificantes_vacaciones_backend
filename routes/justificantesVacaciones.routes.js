import express from 'express'

import { obtenerUsuarios, obtenerEmpresas, obtenerSucursales, obtenerSucursalesAgrupadasEmpresa ,obtenerDepartamentos, obtenerEstatus, obtenerMotivos, obtenerTipoSolicitudes, obtenerDetalleVacacionesDiasEconomicos, obtenerDetalleEmpleadoYJefeDirecto, solicitarAusenciasYRetardos, solicitarVacaciones, solicitarDiasEconomicos, solicitarDiasGanados, solicitarVacacionesVencidas, solicitarSabados5s, obtenerSolicitudesPorEmpleado, obtenerSolicitudPorFolio, actualizarAutorizaciones, finalizarSolicitudAusenciasYRetardos, finalizarSolicitudVacaciones, finalizarSolicitudDiasEconomicos, obtenerDetalleUsuario, obtenerTodasSolicitudes, obtenerDepartamentosSucursales, finalizarSolicitudDiasGanados, finalizarSolicitudVacacionesVencidas, finalizarSolicitudSabados5s, solicitarProrroga, obtenerProrrogasPorEmpleado, finalizarSolicitudProrroga, obtenerAutorizacionesPorEmpleado, obtenerAutorizacionesPendientes, rechazarSolicitudesPendientes, solicitarCapacitaciones, finalizarSolicitudCapacitaciones, obtenerJustificantesMasivos, agregarJustificantesMasivos} from '../controllers/justificantesVacacionesController.js'

const router = express.Router()

router.get('/obtenerUsuarios', obtenerUsuarios)
router.get('/obtenerEmpresas', obtenerEmpresas)
router.get('/obtenerSucursales', obtenerSucursales)
router.get('/sucursalesAgrupadasEmpresas', obtenerSucursalesAgrupadasEmpresa)
router.get('/obtenerDepartamentos', obtenerDepartamentos)
router.get('/obtenerDepartamentosSucursales', obtenerDepartamentosSucursales)
router.get('/obtenerEstatus', obtenerEstatus)
router.get('/obtenerMotivos', obtenerMotivos)
router.get('/obtenerTipoSolicitudes', obtenerTipoSolicitudes)
router.get('/obtenerDetalleVacacionesDiasEconomicos/:numero_empleado', obtenerDetalleVacacionesDiasEconomicos)
router.get('/obtenerDetalleEmpleadoYJefeDirecto/:numero_empleado', obtenerDetalleEmpleadoYJefeDirecto)
router.get('/obtenerSolicitudesPorEmpleado/:numero_empleado', obtenerSolicitudesPorEmpleado)
router.get('/obtenerProrrogasPorEmpleado/:numero_empleado', obtenerProrrogasPorEmpleado)
router.post('/obtenerTodasSolicitudes', obtenerTodasSolicitudes)
router.get('/obtenerSolicitudPorFolio/:folio', obtenerSolicitudPorFolio)
router.get('/obtenerDetalleUsuario/:numero_empleado', obtenerDetalleUsuario)
router.post('/obtenerAutorizacionesPorEmpleado', obtenerAutorizacionesPorEmpleado)
router.get('/obtenerAutorizacionesPendientes', obtenerAutorizacionesPendientes)
router.get('/rechazarAutorizacionesPendientes', rechazarSolicitudesPendientes)

router.post('/obtenerJustificantesMasivos', obtenerJustificantesMasivos)
router.post('/agregarJustificantesMasivos', agregarJustificantesMasivos)

router.post('/solicitarAusenciasYRetardos', solicitarAusenciasYRetardos)
router.post('/solicitarVacaciones', solicitarVacaciones)
router.post('/solicitarDiasEconomicos', solicitarDiasEconomicos)
router.post('/solicitarDiasGanados', solicitarDiasGanados)
router.post('/solicitarVacacionesVencidas', solicitarVacacionesVencidas)
router.post('/solicitarSabados5s', solicitarSabados5s)
router.post('/solicitarProrroga', solicitarProrroga)
router.post('/solicitarCapacitaciones', solicitarCapacitaciones)
router.post('/actualizarAutorizaciones', actualizarAutorizaciones)
router.post('/finalizarSolicitudAusenciasYRetardos/:folio', finalizarSolicitudAusenciasYRetardos)
router.post('/finalizarSolicitudVacaciones/:folio', finalizarSolicitudVacaciones)
router.post('/finalizarSolicitudDiasEconomicos/:folio', finalizarSolicitudDiasEconomicos)
router.post('/finalizarSolicitudDiasGanados/:folio', finalizarSolicitudDiasGanados)
router.post('/finalizarSolicitudVacacionesVencidas/:folio', finalizarSolicitudVacacionesVencidas)
router.post('/finalizarSolicitudSabados5s/:folio', finalizarSolicitudSabados5s)
router.post('/finalizarSolicitudProrroga/:folio', finalizarSolicitudProrroga)
router.post('/finalizarSolicitudCapacitaciones/:folio', finalizarSolicitudCapacitaciones)

export default router