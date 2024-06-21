import dbPuestos from '../config/dbPuestos.js'
import QueryTypes from 'sequelize'
import { insertarUsuariosContpaq, actualizarEstatusUsuario } from './insertarUsuarios.js'

export const obtenerUsuariosContpaq = async () => {
    try {
        const empleados = await dbPuestos.query("SELECT * FROM empleados", { type: QueryTypes.ARRAY })
        await empleados.map(element =>  insertarUsuariosContpaq(element))
        await actualizarEstatusUsuario(empleados)
    } catch ( error ) {
        console.log( error )
    }
}
