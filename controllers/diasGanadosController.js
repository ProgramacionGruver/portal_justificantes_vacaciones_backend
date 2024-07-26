import DiasGanados from '../models/DiasGanados.js'
import Usuarios from '../models/Usuarios.js'

export const obtenerDiasGanados = async (req, res) => {
    try {
      const dias = await DiasGanados.findAll()
      return res.json(dias)
    } catch (error) {
      return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
    }
}

export const agregarDiasGanados = async (req, res) => {
  try {
    const { diasArray } = req.body
    const listaDias = []
    for (const dias of diasArray) {
      const { motivo, diasGanados, numero_empleado } = dias
      const nuevoRegistro = await DiasGanados.create(dias)
      listaDias.push(nuevoRegistro)
      if(motivo === 'Sabados 5s'){
        await Usuarios.update({ sabados5s: diasGanados }, { where: { numero_empleado } })
      }else{
        await Usuarios.update({ diasGanados: diasGanados }, { where: { numero_empleado } })
      }
    }
    return res.json(listaDias)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}