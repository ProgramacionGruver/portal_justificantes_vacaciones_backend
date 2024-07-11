import dbPuestos from '../config/dbPuestos.js'
import CatalogoVacaciones from '../models/CatalogoVacaciones.js'
import QueryTypes from 'sequelize'
import { insertarUsuariosContpaq, actualizarEstatusUsuario } from './insertarUsuarios.js'

export const obtenerUsuariosContpaq = async () => {
    try {
        const empleados = await dbPuestos.query("SELECT * FROM empleados", { type: QueryTypes.ARRAY })
        const catalogoVacaciones = await CatalogoVacaciones.findAll()
        for (const element of empleados) {
            await insertarUsuariosContpaq(element, catalogoVacaciones)
        }
        await actualizarEstatusUsuario(empleados)
    } catch ( error ) {
        console.log( error )
    }
}
