import dbPuestos from '../config/dbPuestos.js'
import CatalogoVacaciones from '../models/CatalogoVacaciones.js'
import Departamentos from '../models/Departamentos.js'
import CatalogoTurnos from '../models/CatalogoTurnos.js'
import Usuarios from '../models/Usuarios.js'
import QueryTypes from 'sequelize'
import { apiSistemas } from '../boot/axiosSistemas.js'
import { insertarUsuariosContpaq, actualizarEstatusUsuario } from './insertarUsuarios.js'
import { enviarCorreo } from './enviarCorreo.js'
import { mensajeCorreoMesVacaciones } from '../constant/mensajeCorreo.js'
import moment from 'moment-timezone'

export const obtenerUsuariosContpaq = async () => {
    try {
        const empleados = await dbPuestos.query("SELECT * FROM empleados", { type: QueryTypes.ARRAY })
        const departamentos = await Departamentos.findAll()
        for (const element of empleados) {
            await insertarUsuariosContpaq(element, departamentos)
            continue
        }
        await actualizarEstatusUsuario(empleados)
        return
    } catch ( error ) {
        console.log( error )
    }
}

export const agregarPermisosUsuarios = async () => {
    try {
        const empleados = await dbPuestos.query("SELECT * FROM empleados", { type: QueryTypes.ARRAY })
        const usuariosRegistrados = await Usuarios.findAll()
        const usuarios = empleados.filter(empleado => 
            !usuariosRegistrados.some(usuario => usuario.numero_empleado === parseInt(empleado.numero))
          )
        const empleadosObj = {
            empleadosArray: usuarios.map(empleado => ({
              numero_empleado: empleado.numero,
              idPortal: 26,
              editedBy: 'programacion'
            }))
        }
        const { data } = await apiSistemas.post('/permisos/masivo/justificantes', empleadosObj)
        return
    } catch ( error ) {
        console.log( error )
    }
}

export const agregarPermisosProrroga = async () => {
    try {
        const usuariosRegistrados = await Usuarios.findAll({ where: { estatus: 1} })
        const turnosEspeciales = await CatalogoTurnos.findAll({where:{ turnoEspecial: 1}})
        const catalogoVacaciones = await CatalogoVacaciones.findAll()
        const hoy = moment().startOf('day')
        for (const usuario of usuariosRegistrados) {
                const fechaIngreso = moment(usuario.fechaAlta).startOf('day')
                const aniosEnEmpresa = hoy.diff(fechaIngreso, 'years')
                const aniversario = fechaIngreso.add(aniosEnEmpresa, 'years')
                const proximoAniversario = moment(aniversario).add(1, 'year').startOf('day')
                const esAniversario = hoy.isSame(aniversario, 'day')
                const turnoEspecialSabado = turnosEspeciales.filter(elemento => elemento.turno ===  usuario.turnoSabados)
                const trabajaSabado = turnoEspecialSabado.length === 0
                const vacaciones = catalogoVacaciones.find(dia => dia.aniosLaborados === aniosEnEmpresa && dia.sabadoLaborado === trabajaSabado)
                const faltaUnMes = hoy.isSame(moment(proximoAniversario).subtract(1, 'month'), 'day')
                const faltaQuinceDias = hoy.isSame(moment(proximoAniversario).subtract(15, 'days'), 'day')
                
                if(faltaUnMes && usuario.diasVacacionesRestantes > 0){
                    await enviarCorreo(['amagdaleno@gruver.mx'],`Aprovecha tus vacaciones: Queda un mes para tu aniversario`, mensajeCorreoMesVacaciones(usuario, proximoAniversario))
                }else if(faltaQuinceDias && usuario.diasVacacionesRestantes > 0){
                     const { data } = await apiSistemas.post('/permisos/justificantes/prorroga', usuario.datavalues)
                }else if(esAniversario){
                    const { data } = await apiSistemas.delete('/permisos/justificantes/prorroga', { data: usuario.dataValues })
                    await Usuarios.update({diasVacacionesLey: vacaciones.diasAsignados, diasVacacionesRestantes: vacaciones.diasAsignados}, {where:{numero_empleado: usuario.numero_empleado}})
                }
                continue
        }
        return
    } catch ( error ) {
        console.log( error )
    }
}
