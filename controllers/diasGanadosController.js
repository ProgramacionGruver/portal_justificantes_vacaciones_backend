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
    let listaDias, usuario
    for (const dias of diasArray) {
      const { diasGanados, numero_empleado } = dias
      listaDias = await DiasGanados.create(dias)
      usuario = await Usuarios.update({diasGanados: diasGanados},{where:{numero_empleado}})
    }
    return res.json(diasArray)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}