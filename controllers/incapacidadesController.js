import Incapacidades from '../models/Incapacidades.js'
import IncapacidadesNominas from '../models/IncapacidadesNominas.js'
import db from '../config/db.js'
import dayjs from 'dayjs'
import path from 'path'
import fs from 'fs'
import { Op, Sequelize} from 'sequelize'

const pathFotos = '/recursos/documentos/portalJustificantes/incapacidades'

export const obtenerIncapacidades = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body

    const fechaInicioStr = dayjs(fechaInicio).format('YYYY-MM-DD')
    const fechaFinStr = dayjs(fechaFin).format('YYYY-MM-DD')

    const todasIncapacidades = await IncapacidadesNominas.findAll({
      where: {
        [Op.and]: [
          Sequelize.where(Sequelize.literal(`CAST(incapacidades_nominas.fechaExpedido AS DATE)`), {
            [Op.gte]: fechaInicioStr
          }),
          Sequelize.where(Sequelize.literal(`CAST(incapacidades_nominas.fechaExpedido AS DATE)`), {
            [Op.lte]: fechaFinStr
          })
        ]
      },
      order: [['idIncapacidadNomina', 'DESC']],
    })

    return res.json(todasIncapacidades)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const agregarIncapacidades = async (req, res) => {
  const transaccion = await db.transaction()
  try {
    // Parsear las cadenas JSON a objetos
    const diasIncapacidades = JSON.parse(req.body.diasIncapacidades)
    const diasIncapacidadesNomina = JSON.parse(req.body.diasIncapacidadesNomina)
    
    const archivos = req.files

    //Si no hay archivo de incapacidad rechaza, los demas son opcionales
    if (!archivos || !archivos['archivo']) {
      await transaccion.rollback()
      return res.status(400).json({ message: "No se ha seleccionado un archivo" })
    }

    const archivosSubidos = []
    const guardarArchivo = async (campo, sufijo = '') => {
      if (archivos[campo]) {
        const archivo = archivos[campo][0]
        const nombreArchivo = sufijo ? `${diasIncapacidadesNomina.folio}-${sufijo}.pdf` : `${diasIncapacidadesNomina.folio}.pdf`
        const rutaActual = path.join(pathFotos, archivo.filename)
        const nuevaRuta = path.join(pathFotos, nombreArchivo)

        await new Promise((resolve, reject) => {
          fs.rename(rutaActual, nuevaRuta, (err) => {
            if (err) {
              return reject(err);
            }
            archivosSubidos.push(nuevaRuta);
            resolve()
          })
        })
      }
    }
    //Guarda obligatoriamente archivo, los demas son opcionales
    await guardarArchivo('archivo')
    await guardarArchivo('archivoSt7', 'St7')
    await guardarArchivo('archivoSt2', 'St2')
    await guardarArchivo('archivoSiaat', 'Siaat')

    let incapacidad = await IncapacidadesNominas.findOne({ where: { folio: diasIncapacidadesNomina.folio }, transaction: transaccion })
    if (incapacidad) {
      await transaccion.rollback()
      return res.status(500).json({ message: "Ya existe el registro" })
    }
    incapacidad = await IncapacidadesNominas.create(diasIncapacidadesNomina, { transaction: transaccion })

    const listaDias = []
    for (const dias of diasIncapacidades) {
      const nuevoRegistro = await Incapacidades.create(dias, { transaction: transaccion })
      listaDias.push(nuevoRegistro)
    }
    await transaccion.commit()
    return res.json(incapacidad)
  } catch (error) {
     // Si hay un error, deshacer la transacción y eliminar los archivos que fueron movidos
     await transaccion.rollback()
     archivosSubidos.forEach(ruta => {
       if (fs.existsSync(ruta)) {
         fs.unlinkSync(ruta)
       }
     })
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const actualizarIncapacidades = async (req, res) => {
  const transaccion = await db.transaction()
  try {

    const diasIncapacidades = JSON.parse(req.body.diasIncapacidades)
    const diasIncapacidadesNomina = JSON.parse(req.body.diasIncapacidadesNomina)

    const archivosSubidos = []
    const guardarArchivo = async (campo, sufijo = '') => {
      if (req.files && req.files[campo]) {
        const archivo = req.files[campo][0]
        const nombreArchivo = sufijo ? `${diasIncapacidadesNomina.folio}-${sufijo}.pdf` : `${diasIncapacidadesNomina.folio}.pdf`
        const rutaActual = path.join(pathFotos, archivo.filename)
        const nuevaRuta = path.join(pathFotos, nombreArchivo)

        await new Promise((resolve, reject) => {
          fs.rename(rutaActual, nuevaRuta, (err) => {
            if (err) {
              return reject(err)
            }
            archivosSubidos.push(nuevaRuta)
            resolve()
          })
        })
        return nuevaRuta
      }
      return null
    }

    const rutaArchivoGeneral = await guardarArchivo('archivo')
    const rutaArchivoSt7 = await guardarArchivo('archivoSt7', 'St7')
    const rutaArchivoSt2 = await guardarArchivo('archivoSt2', 'St2')
    const rutaArchivoSiaat = await guardarArchivo('archivoSiaat', 'Siaat')

    let incapacidad = await IncapacidadesNominas.findOne({
      where: { idIncapacidadNomina: diasIncapacidadesNomina.idIncapacidadNomina },
      transaction: transaccion
    })

    if (incapacidad) {

      if (rutaArchivoGeneral) diasIncapacidadesNomina.rutaArchivo = rutaArchivoGeneral
      if (rutaArchivoSt7) diasIncapacidadesNomina.rutaArchivoSt7 = rutaArchivoSt7
      if (rutaArchivoSt2) diasIncapacidadesNomina.rutaArchivoSt2 = rutaArchivoSt2
      if (rutaArchivoSiaat) diasIncapacidadesNomina.rutaArchivoSiaat = rutaArchivoSiaat

      await Incapacidades.destroy({
        where: { folio: incapacidad.folio },
        transaction: transaccion
      })

      await incapacidad.update(diasIncapacidadesNomina, { transaction: transaccion })

      const listaDias = []
      for (const dias of diasIncapacidades) {
        const nuevoRegistro = await Incapacidades.create(dias, { transaction: transaccion })
        listaDias.push(nuevoRegistro)
      }
    } else {
      await transaccion.rollback()
      return res.status(500).json({ message: "No se encontro el registro" })
    }

    await transaccion.commit()
    return res.json(incapacidad)
  } catch (error) {
    await transaccion.rollback()
    archivosSubidos.forEach(ruta => {
      if (fs.existsSync(ruta)) {
        fs.unlinkSync(ruta)
      }
    })
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const actualizarEstatusIncapacidad= async (req, res) => {
  const transaccion = await db.transaction()
  try {
    const { idIncapacidadNomina } = req.body

    let incapacidad = await IncapacidadesNominas.findOne({ where: { idIncapacidadNomina },transaction: transaccion})
    if (incapacidad) {
        await incapacidad.update(req.body, { transaction: transaccion })
      } else {
        await transaccion.rollback()
        return res.status(500).json({ message: "No se encontro el registro" })
    }
    await transaccion.commit()
    return res.json(incapacidad)
  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}