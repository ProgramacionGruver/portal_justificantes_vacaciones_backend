import db from '../config/db.js'
import { QueryTypes } from 'sequelize'
import Usuarios from '../models/Usuarios.js'
import Empresas from '../models/Empresas.js'
import Sucursales from '../models/Sucursales.js'
import Departamentos from '../models/Departamentos.js'
import CatalogoEstatus from '../models/CatalogoEstatus.js'
import CatalogoMotivos from '../models/CatalogoMotivos.js'
import CatalogoTipoSolicitudes from '../models/CatalogoTipoSolicitudes.js'

export const obtenerUsuarios = async (req, res) => {
  try {

    const todosUsuarios = await Usuarios.findAll()
    return res.json(todosUsuarios)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerEmpresas = async (req, res) => {
  try {

    const todasEmpresas = await Empresas.findAll()
    return res.json(todasEmpresas)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerSucursales = async (req, res) => {
  try {

    const todasSucursales = await Sucursales.findAll()
    return res.json(todasSucursales)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerDepartamentos = async (req, res) => {
  try {

    const todosDepartamentos = await Departamentos.findAll()
    return res.json(Departamentos)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerEstatus = async (req, res) => {
  try {

    const todosEstatus = await CatalogoEstatus.findAll()
    return res.json(todosEstatus)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerMotivos = async (req, res) => {
  try {

    const todosMotivos = await CatalogoMotivos.findAll()
    return res.json(todosMotivos)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerTipoSolicitudes = async (req, res) => {
  try {

    const todosTiposSolicitudes = await CatalogoTipoSolicitudes.findAll()
    return res.json(todosTiposSolicitudes)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}