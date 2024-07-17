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
      const { diasGanados, idUsuario } = dias
      listaDias = await DiasGanados.create(req.body)
      usuario = await Usuarios.update({diasGanados: diasGanados},{where:{idUsuario}})
    }
    return res.json(dias)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}