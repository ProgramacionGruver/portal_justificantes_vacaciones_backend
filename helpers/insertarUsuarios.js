import Usuarios from '../models/Usuarios.js'
import { formatName } from './formatearString.js'
import { ESTATUS_USUARIO } from '../constant/estatusConst.js'
import moment from 'moment-timezone'

export const insertarUsuariosContpaq = async (nuevoUsuario) => {
    const { numero } = nuevoUsuario
    try {
        await Usuarios.findOne({ where: { numero_empleado: numero, estatus: ESTATUS_USUARIO.ACTIVO } }).then(async (usuarioObj) => {
        
        const fechaIngreso = moment(nuevoUsuario.fecha_ingreso).add(1, 'day').format('YYYY-MM-DD')

            // Si existe actualiza el registro
            if (usuarioObj) {
                return usuarioObj.update({
                    puesto: nuevoUsuario.puesto,
                    departamento: nuevoUsuario.departamento,
                    centroTrabajo: nuevoUsuario.n_centro,
                    siglasCentroTrabajo: nuevoUsuario.centro,
                    numeroEmpleadoJefe: nuevoUsuario.numero_jefe,
                    fechaAlta: fechaIngreso,
                    division: nuevoUsuario.division,
                })
            }
            // no existe

            await Usuarios.create({
                numero_empleado: nuevoUsuario.numero,
                nombre: formatName(`${nuevoUsuario.nombre} ${nuevoUsuario.apaterno} ${nuevoUsuario.amaterno}`),
                puesto: formatName(nuevoUsuario.puesto),
                fechaAlta: fechaIngreso,
                departamento: nuevoUsuario.departamento,
                centroTrabajo: nuevoUsuario.n_centro,
                siglasCentroTrabajo: nuevoUsuario.centro,
                numeroEmpleadoJefe: nuevoUsuario.numero_jefe,
                division: nuevoUsuario.division,
            })
        })

    } catch (error) {
        console.log(error)
    }
}

export const actualizarEstatusUsuario = async (nuevoUsuario) => {
    const empeladoPortal = await Usuarios.findAll()
    try {

        const noEmpleadosSistemas = empeladoPortal.map(usuario => usuario.dataValues)
    const noEmpleadosContpaqi = nuevoUsuario.map(usuario => parseInt(usuario.numero))

    const empleadosMuertos = noEmpleadosSistemas.filter(usuario => {
        const numeroEmpleado = parseInt(usuario.numero_empleado)
        return !noEmpleadosContpaqi.includes(numeroEmpleado) && usuario.estatus == 1
    })

    if (empleadosMuertos.length !== 0) {

        empleadosMuertos.map(async empleado => {
            await Usuarios.update(
                { estatus: ESTATUS_USUARIO.INACTIVO },
                { where: { numero_empleado: empleado.numero_empleado } }
            )
        })
        return
    }

    } catch (error) {
        console.log(error)
    }
}