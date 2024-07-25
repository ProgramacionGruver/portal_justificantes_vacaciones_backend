import Usuarios from '../models/Usuarios.js'
import { formatName } from './formatearString.js'
import { ESTATUS_USUARIO } from '../constant/estatusConst.js'
import moment from 'moment-timezone'

export const insertarUsuariosContpaq = async (nuevoUsuario, departamentos) => {
    const { numero } = nuevoUsuario
    try {
        const usuarioObj = await Usuarios.findOne({ where: { numero_empleado: numero, estatus: ESTATUS_USUARIO.ACTIVO } })
        const fechaIngreso = moment(nuevoUsuario.fecha_ingreso).add(1, 'day').format('YYYY-MM-DD')
        const aniosEnEmpresa = moment().diff(moment(fechaIngreso, 'YYYY-MM-DD'), 'years')
        let claveEmpresa = nuevoUsuario.centro.slice(0, 2)
        if (claveEmpresa === 'GE' || claveEmpresa === 'CE') {
            claveEmpresa = nuevoUsuario.centro.slice(2, 4)
        }
        const claveDepartamentoObj = departamentos.find(departamento => departamento.nombreDepartamento === nuevoUsuario.departamento)
        const claveDepartamento = claveDepartamentoObj ? claveDepartamentoObj.claveDepartamento : null

        // Si existe actualiza el registro
        if (usuarioObj) {
                    return usuarioObj.update({
                        puesto: nuevoUsuario.puesto,
                        departamento: nuevoUsuario.departamento,
                        centroTrabajo: nuevoUsuario.n_centro,
                        claveSucursal: nuevoUsuario.centro,
                        numeroEmpleadoJefe: nuevoUsuario.numero_jefe,
                        fechaAlta: fechaIngreso,
                        aniosLaborados: aniosEnEmpresa,
                        division: nuevoUsuario.division,
                        claveEmpresa: claveEmpresa,
                        claveDepartamento: claveDepartamento
                    })
                
        }else{
            // No existe crea el usuario
                return Usuarios.create({
                    numero_empleado: nuevoUsuario.numero,
                    nombre: formatName(`${nuevoUsuario.nombre} ${nuevoUsuario.apaterno} ${nuevoUsuario.amaterno}`),
                    puesto: formatName(nuevoUsuario.puesto),
                    fechaAlta: fechaIngreso,
                    aniosLaborados: aniosEnEmpresa,
                    diasEconomicosLey: 3,
                    diasEconomicosRestantes: 3,
                    departamento: nuevoUsuario.departamento,
                    centroTrabajo: nuevoUsuario.n_centro,
                    claveSucursal: nuevoUsuario.centro,
                    numeroEmpleadoJefe: nuevoUsuario.numero_jefe,
                    division: nuevoUsuario.division,
                    claveEmpresa: claveEmpresa,
                    claveDepartamento: claveDepartamento
                })
        }
    } catch (error) {
        console.log(error)
    }
}

export const actualizarEstatusUsuario = async (nuevoUsuario) => {
    try {
        //Si es 01 de Enero actualiza Dias Economicos
        const hoy = moment()
        const anioNuevo = hoy.date() === 1 && hoy.month() === 0
        if(anioNuevo){
            await Usuarios.update({diasEconomicosLey: 3, diasEconomicosRestantes: 3},{where:{}})
        }

        const empeladoPortal = await Usuarios.findAll()
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
        return
    } catch (error) {
        console.log(error)
    }
}