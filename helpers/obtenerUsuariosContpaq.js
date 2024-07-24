import dbPuestos from '../config/dbPuestos.js'
import CatalogoVacaciones from '../models/CatalogoVacaciones.js'
import Departamentos from '../models/Departamentos.js'
import QueryTypes from 'sequelize'
import Usuarios from '../models/Usuarios.js'
import { apiSistemas } from '../boot/axiosSistemas.js'
import { insertarUsuariosContpaq, actualizarEstatusUsuario } from './insertarUsuarios.js'

export const obtenerUsuariosContpaq = async () => {
    try {
        const empleados = await dbPuestos.query("SELECT * FROM empleados", { type: QueryTypes.ARRAY })
        const catalogoVacaciones = await CatalogoVacaciones.findAll()
        const departamentos = await Departamentos.findAll()
        for (const element of empleados) {
            await insertarUsuariosContpaq(element, catalogoVacaciones, departamentos)
        }
        await actualizarEstatusUsuario(empleados)
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
    } catch ( error ) {
        console.log( error )
    }
}
