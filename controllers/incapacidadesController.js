import Incapacidades from '../models/Incapacidades.js'

export const obtenerIncapacidades = async (req, res) => {
    try {
      const dias = await Incapacidades.findAll()
      return res.json(dias)
    } catch (error) {
      return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
    }
}

export const agregarIncapacidades = async (req, res) => {
  try {
    const { diasArray } = req.body
    const listaDias = []
    for (const dias of diasArray) {
      const nuevoRegistro = await Incapacidades.create(dias)
      listaDias.push(nuevoRegistro)
    }
    return res.json(listaDias)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}