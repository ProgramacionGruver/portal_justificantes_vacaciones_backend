import db from '../config/db.js'
import { QueryTypes } from 'sequelize'
import Usuarios from '../models/Usuarios.js'
import Empresas from '../models/Empresas.js'
import Sucursales from '../models/Sucursales.js'
import Departamentos from '../models/Departamentos.js'
import CatalogoEstatus from '../models/CatalogoEstatus.js'
import CatalogoMotivos from '../models/CatalogoMotivos.js'
import CatalogoTipoSolicitudes from '../models/CatalogoTipoSolicitudes.js'
import { queryObtenerEmpleado } from '../constant/querys.js'
import Solicitudes from '../models/Solicitudes.js'
import SolicitudDetalle from '../models/SolicitudDetalle.js'
import AutorizacionesSolicitudes from '../models/AutorizacionesSolicitudes.js'

export const obtenerUsuarios = async (req, res) => {
  try {
    const todosUsuarios = await Usuarios.findAll()

    if (!todosUsuarios || todosUsuarios.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios." })
    }

    return res.json(todosUsuarios)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema: " + error.message })
  }
}

export const obtenerEmpresas = async (req, res) => {
  try {
    const todasEmpresas = await Empresas.findAll()

    if (!todasEmpresas || todasEmpresas.length === 0) {
      return res.status(404).json({ message: "No se encontraron empresas." })
    }

    return res.json(todasEmpresas)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema: " + error.message })
  }
}

export const obtenerSucursales = async (req, res) => {
  try {
    const todasSucursales = await Sucursales.findAll()

    if (!todasSucursales || todasSucursales.length === 0) {
      return res.status(404).json({ message: "No se encontraron sucursales." })
    }

    return res.json(todasSucursales)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema: " + error.message })
  }
}

export const obtenerDepartamentos = async (req, res) => {
  try {
    const todosDepartamentos = await Departamentos.findAll()

    if (!todosDepartamentos || todosDepartamentos.length === 0) {
      return res.status(404).json({ message: "No se encontraron departamentos." })
    }

    return res.json(todosDepartamentos)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema: " + error.message })
  }
}

export const obtenerEstatus = async (req, res) => {
  try {
    const todosEstatus = await CatalogoEstatus.findAll()

    if (!todosEstatus || todosEstatus.length === 0) {
      return res.status(404).json({ message: "No se encontraron estatus." })
    }

    return res.json(todosEstatus)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema: " + error.message })
  }
}

export const obtenerMotivos = async (req, res) => {
  try {
    const todosMotivos = await CatalogoMotivos.findAll()

    if (!todosMotivos || todosMotivos.length === 0) {
      return res.status(404).json({ message: "No se encontraron motivos." })
    }

    return res.json(todosMotivos)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema: " + error.message })
  }
}

export const obtenerTipoSolicitudes = async (req, res) => {
  try {
    const todosTiposSolicitudes = await CatalogoTipoSolicitudes.findAll()

    if (!todosTiposSolicitudes || todosTiposSolicitudes.length === 0) {
      return res.status(404).json({ message: "No se encontraron tipos de solicitudes." })
    }

    return res.json(todosTiposSolicitudes)

  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema: " + error.message })
  }
}


export const obtenerDetalleVacacionesDiasEconomicos = async (req, res) => {
  try {
    const { id } = req.params

    //Inf. del empleado, cuantas vacaciones, cuantos días econom.
    const informacionEmpleado = await Usuarios.findOne({ where: { numero_empleado: id } })

    if (!informacionEmpleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    return res.json(informacionEmpleado)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerDetalleEmpleadoYJefeDirecto = async (req, res) => {
  try {
    const { id } = req.params

    const [detalleEmpleado] = await db.query(queryObtenerEmpleado(id), { type: QueryTypes.SELECT })

    if (!detalleEmpleado) {
      return res.status(404).json({ message: "Empleado no encontrado." })
    }

    const { numeroEmpleadoJefe } = detalleEmpleado

    let detalleJefe = null

    if (numeroEmpleadoJefe) {
      const [jefe] = await db.query(queryObtenerEmpleado(numeroEmpleadoJefe), { type: QueryTypes.SELECT })
      detalleJefe = jefe || null
    }

    return res.json({ detalleEmpleado, detalleJefe })

  } catch (error) {
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const obtenerSolicitudesPorEmpleado = async (req, res) => {
  try {
    const { id } = req.params

    const todasSolicitudes = await Solicitudes.findAll({
      where: {
        numero_empleado: id
      },
      include: [
        CatalogoTipoSolicitudes,
        Empresas,
        Sucursales,
        Departamentos,
        CatalogoMotivos,
        {
          model: SolicitudDetalle,
          include: [
            CatalogoEstatus,
            {
              model: AutorizacionesSolicitudes,
              include: [CatalogoEstatus],
            },
          ],
        },
      ],
      order: [['idSolicitud', 'DESC']],
    })

    return res.json(todasSolicitudes)
  } catch (error) {
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}


export const solicitarAusenciasYRetardos = async (req, res) => {
  const transaccion = await db.transaction()

  try {
    const PASE_ENTRADA = 1
    const PASE_SALIDA = 2
    const FALTA = 3

    const nuevosDatos = req.body

    const { usuariosAutorizan: { primeraAutorizacion, segundaAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos)

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud } })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const detalles = []

    if ([PASE_ENTRADA, PASE_SALIDA].includes(nuevosDatos.idMotivo)) {
      const detalle = await SolicitudDetalle.create(nuevosDatos)
      detalles.push(detalle)
    }

    if ([FALTA].includes(nuevosDatos.idMotivo) && nuevosDatos.fechasSeleccionadas?.length > 0) {
      const fechasMapeadas = nuevosDatos.fechasSeleccionadas.map(fecha => {
        return {
          folio: nuevosDatos.folio,
          fechaDiaSolicitado: fecha,
          idEstatusSolicitud: nuevosDatos.idEstatusSolicitud,
          horaDiaSolicitado: null,
        }
      })
      const detallesFalta = await SolicitudDetalle.bulkCreate(fechasMapeadas)
      detalles.push(...detallesFalta)
    }

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      })

      // Segunda autorización admvo. camiones || R.H.
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: segundaAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: segundaAutorizacion.nombre,
        idTipoAutorizacion: 2,
      })
    }

    await transaccion.commit()
    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        CatalogoTipoSolicitudes,
        Empresas,
        Sucursales,
        Departamentos,
        CatalogoMotivos,
        {
          model: SolicitudDetalle,
          include: [
            CatalogoEstatus,
            {
              model: AutorizacionesSolicitudes,
              include: [CatalogoEstatus],
            },
          ],
        },
      ],
    })

    return res.json(solicitudCreada)

  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const solicitarVacaciones = async (req, res) => {
  const transaccion = await db.transaction()

  try {
    
    const nuevosDatos = req.body

    const { usuariosAutorizan: { primeraAutorizacion, segundaAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos)

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud } })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const fechasMapeadas = nuevosDatos.fechasSeleccionadas.map(fecha => { return { folio: nuevosDatos.folio, fechaDiaSolicitado: fecha, idEstatusSolicitud: nuevosDatos.idEstatusSolicitud, horaDiaSolicitado: null } })
    const detalles = await SolicitudDetalle.bulkCreate(fechasMapeadas)

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      })

      // Segunda autorización admvo. camiones || R.H.
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: segundaAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: segundaAutorizacion.nombre,
        idTipoAutorizacion: 2,
      })
    }

    await transaccion.commit()

    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        CatalogoTipoSolicitudes,
        Empresas,
        Sucursales,
        Departamentos,
        CatalogoMotivos,
        {
          model: SolicitudDetalle,
          include: [
            CatalogoEstatus,
            {
              model: AutorizacionesSolicitudes,
              include: [CatalogoEstatus],
            },
          ],
        },
      ],
    })

    return res.json(solicitudCreada)

  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const solicitarDiasEconomicos = async (req, res) => {
  const transaccion = await db.transaction()

  try {

    const nuevosDatos = req.body

    const { usuariosAutorizan: { primeraAutorizacion, segundaAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos)

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud } })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const fechasMapeadas = nuevosDatos.fechasSeleccionadas.map(fecha => { return { folio: nuevosDatos.folio, fechaDiaSolicitado: fecha, idEstatusSolicitud: nuevosDatos.idEstatusSolicitud, horaDiaSolicitado: null } })
    const detalles = await SolicitudDetalle.bulkCreate(fechasMapeadas)

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      })

      // Segunda autorización admvo. camiones || R.H.
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: segundaAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: segundaAutorizacion.nombre,
        idTipoAutorizacion: 2,
      })
    }

    await transaccion.commit()

    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        CatalogoTipoSolicitudes,
        Empresas,
        Sucursales,
        Departamentos,
        CatalogoMotivos,
        {
          model: SolicitudDetalle,
          include: [
            CatalogoEstatus,
            {
              model: AutorizacionesSolicitudes,
              include: [CatalogoEstatus],
            },
          ],
        },
      ],
    })

    return res.json(solicitudCreada)

  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}