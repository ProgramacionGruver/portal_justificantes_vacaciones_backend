import { QueryTypes } from 'sequelize'

export const obtenerChecks = async (req, res) => {
  try {

    const todoschecks = await Usuarios.findAll()
    return res.json(todoschecks)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

