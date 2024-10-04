import dbPuestos from '../config/dbPuestos.js'
import db from '../config/db.js'
import CatalogoVacaciones from '../models/CatalogoVacaciones.js'
import Sucursales from '../models/Sucursales.js'
import Departamentos from '../models/Departamentos.js'
import CatalogoTurnos from '../models/CatalogoTurnos.js'
import Usuarios from '../models/Usuarios.js'
import QueryTypes from 'sequelize'
import { apiSistemas } from '../boot/axiosSistemas.js'
import { insertarUsuariosContpaq, actualizarEstatusUsuario } from './insertarUsuarios.js'
import { enviarCorreo } from './enviarCorreo.js'
import { mensajeCorreoMesVacaciones } from '../constant/mensajeCorreo.js'
import { queryObtenerEmpleado } from '../constant/querys.js'
import moment from 'moment-timezone'
import { enviarCorreoErrores } from './correosErrores.js'

export const obtenerUsuariosContpaq = async () => {
    try {
        const empleados = await dbPuestos.query("SELECT * FROM empleados", { type: QueryTypes.ARRAY })
        const departamentos = await Departamentos.findAll()
        const sucursales = await Sucursales.findAll()
        for (const element of empleados) {
            await insertarUsuariosContpaq(element, sucursales, departamentos)
            continue
        }
        await actualizarEstatusUsuario(empleados)
        return
    } catch ( error ) {
        await enviarCorreoErrores(`[Error obtenerUsuariosContpaq / [${error.message}]`)
    }
}

export const agregarPermisosUsuarios = async () => {
    try {
        const permisos = await dbPuestos.query("SELECT * FROM [portal_sistemas].[dbo].permisosPortales", { type: QueryTypes.ARRAY })
        const usuariosRegistrados = await dbPuestos.query("SELECT * FROM [portal_sistemas].[dbo].usuarios AS usuarios WHERE usuarios.estatus = 1", { type: QueryTypes.ARRAY })

        const usuarios = usuariosRegistrados.filter(empleado => 
            !permisos.some(permiso => permiso.idUsuario === empleado.idUsuario && permiso.idPortal === 26)
          )
        const empleadosObj = {
            empleadosArray: usuarios.map(empleado => ({
              numero_empleado: empleado.numero_empleado,
              idPortal: 26,
              editedBy: 'programacion'
            }))
        }
        const { data } = await apiSistemas.post('/permisos/masivo/justificantes', empleadosObj)
        return
    } catch ( error ) {
        await enviarCorreoErrores(`[Error agregarPermisosUsuarios / [${error.message}]`)
    }
}

export const agregarPermisosProrroga = async () => {
    try {
        const usuariosRegistrados = await Usuarios.findAll({ where: { estatus: 1} })
        const turnosEspeciales = await CatalogoTurnos.findAll({where:{ turnoEspecial: 1}})
        const catalogoVacaciones = await CatalogoVacaciones.findAll()
        const hoy = moment().startOf('day')
        for (const usuario of usuariosRegistrados) {
                //INGRESO Y ANIVERSARIO
                const fechaIngreso = moment(usuario.fechaAlta).startOf('day')
                const aniosEnEmpresa = hoy.diff(fechaIngreso, 'years')
                const aniversario = fechaIngreso.add(aniosEnEmpresa, 'years')
                const proximoAniversario = moment(aniversario).add(1, 'year').startOf('day')
                const esAniversario = hoy.isSame(aniversario, 'day')

                //DIAS DE VACACIONES CORRESPONDIENTES
                const turnoEspecialSabado = turnosEspeciales.filter(elemento => elemento.turno ===  usuario.turnoSabados)
                const trabajaSabado = turnoEspecialSabado.length === 0 || turnoEspecialSabado[0]?.turno !== 'No Labora'
                const vacaciones = catalogoVacaciones.find(dia => dia.aniosLaborados === aniosEnEmpresa && dia.sabadoLaborado === trabajaSabado)
                
                //NOTIFICACION DIAS POR VENCER
                const faltaUnMes = hoy.isSame(moment(proximoAniversario).subtract(1, 'month'), 'day')
                const faltaQuinceDias = hoy.isSame(moment(proximoAniversario).subtract(15, 'days'), 'day')

                // QUITAR DIAS DE VACACIONES VENCIDOS DESPUES DE 3 MESES
                const tresMesesDespuesAniversario = moment(proximoAniversario).add(3, 'months').startOf('day');
                const pasaronTresMesesAniversario = hoy.isSameOrAfter(tresMesesDespuesAniversario, 'day');

                // QUITAR DIAS DE VACACIONES VENCIDOS DESPUES DE 6 MESES
                const seisMesesDespuesAniversario = moment(proximoAniversario).add(6, 'months').startOf('day');
                const pasaronSeisMesesAniversario = hoy.isSameOrAfter(seisMesesDespuesAniversario, 'day');

                if(pasaronTresMesesAniversario){
                    await Usuarios.update({vacacionesVencidasRestantes: 0}, {where:{numero_empleado: usuario.numero_empleado}})
                }

                if(pasaronSeisMesesAniversario){
                    await Usuarios.update({vacacionesVencidasRestantes: 0}, {where:{numero_empleado: usuario.numero_empleado}})
                }

                const [detalleEmpleado] = await db.query(queryObtenerEmpleado(usuario.numero_empleado), { type: QueryTypes.SELECT })
                if(faltaUnMes && usuario.diasVacacionesRestantes > 0){
                    let correo
                    const [detalleJefe] = await db.query(queryObtenerEmpleado(usuario.numeroEmpleadoJefe), { type: QueryTypes.SELECT })
                    if (detalleEmpleado[0]?.correo && detalleEmpleado[0].correo !== '') {
                        correo = detalleEmpleado[0].correo
                    } else {
                        correo = detalleJefe[0].correo
                    }
                    await enviarCorreo([correo],`Aprovecha tus vacaciones: Queda un mes para tu aniversario`, mensajeCorreoMesVacaciones(usuario, proximoAniversario))
                }else if(faltaQuinceDias && usuario.diasVacacionesRestantes > 0){
                    const { data } = await apiSistemas.post('/permisos/justificantes/prorroga', detalleEmpleado[0])
                }else if(esAniversario && aniosEnEmpresa > 0){
                    const { data } = await apiSistemas.delete('/permisos/justificantes/prorroga', { data: detalleEmpleado[0] })
                    await Usuarios.update({diasVacacionesLey: vacaciones.diasAsignados, diasVacacionesRestantes: vacaciones.diasAsignados}, {where:{numero_empleado: usuario.numero_empleado}})
                }
                continue
                }
        return
    } catch ( error ) {
        await enviarCorreoErrores(`[Error agregarPermisosProrroga / [${error.message}]`)
    }
}
