import express from 'express'

import { obtenerUsuarios, obtenerEmpresas, obtenerSucursales, obtenerDepartamentos, obtenerEstatus, obtenerMotivos, obtenerTipoSolicitudes} from '../controllers/justificantesVacacionesController.js'

const router = express.Router()

router.get('/obtenerUsuarios', obtenerUsuarios)
router.get('/obtenerEmpresas', obtenerEmpresas)
router.get('/obtenerSucursales', obtenerSucursales)
router.get('/obtenerDepartamentos', obtenerDepartamentos)
router.get('/obtenerEstatus', obtenerEstatus)
router.get('/obtenerMotivos', obtenerMotivos)
router.get('/obtenerTipoSolicitudes', obtenerTipoSolicitudes)




export default router