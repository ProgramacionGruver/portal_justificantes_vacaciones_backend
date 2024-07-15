import CatalogoVacaciones from "../models/CatalogoVacaciones.js"
import CatalogoTurnos from "../models/CatalogoTurnos.js"
import Usuarios from "../models/Usuarios.js"

export const obtenerCatologoVacaciones = async (req, res) => {
  try {
    const vacaciones = await CatalogoVacaciones.findAll()
    return res.json(vacaciones)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const agregarCatologoVacaciones = async (req, res) => {
  try {
    const { aniosLaborados, sabadoLaborado } = req.body
    const vacacion = await CatalogoVacaciones.findOne({where:{aniosLaborados, sabadoLaborado}})
    if(vacacion){
      return res.status(500).json({ message: "Ya existe el registro" })
    }
    const vacaciones = await CatalogoVacaciones.create(req.body)
    return res.json(vacaciones)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const actualizarCatologoVacaciones = async (req, res) => {
  try {
    const { idVacaciones } = req.params
    const vacacion = await CatalogoVacaciones.findOne({where:{ idVacaciones }})
    if(!vacacion){
      return res.status(500).json({ message: "No se encontro el registro" })
    }
    const vacaciones = await CatalogoVacaciones.update(req.body,{where:{idVacaciones}})
    return res.json(vacaciones)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const eliminarCatologoVacaciones = async (req, res) => {
  try {
    const { idVacaciones } = req.params
    const vacacion = await CatalogoVacaciones.findOne({where:{ idVacaciones }})
    if(!vacacion){
      return res.status(500).json({ message: "No se encontro el registro" })
    }
    const vacaciones = await CatalogoVacaciones.destroy({where:{idVacaciones}})
    return res.json(vacaciones)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerCatologoUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll()
    return res.json(usuarios)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const actualizarCatologoUsuarios = async (req, res) => {
  try {
    const { idUsuario } = req.params
    const usuario = await Usuarios.findOne({where:{ idUsuario }})
    if(!usuario){
      return res.status(500).json({ message: "No se encontro el usuario" })
    }
    const usuarios = await Usuarios.update(req.body,{where:{idUsuario}})
    return res.json(usuarios)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerCatologoTurnos = async (req, res) => {
  try {
    const turnos = await CatalogoTurnos.findAll()
    return res.json(turnos)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const agregarCatalogoTurnos = async (req, res) => {
  try {
    const turnos = await CatalogoTurnos.create(req.body)
    return res.json(turnos)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}