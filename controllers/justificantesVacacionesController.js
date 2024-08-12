import db from '../config/db.js'
import { QueryTypes, Op, Sequelize} from 'sequelize'
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
import DepartamentosSucursales from '../models/DepartamentosSucursales.js'
import dayjs from 'dayjs'

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

export const obtenerSucursalesAgrupadasEmpresa = async (req, res) => {
  try {
    const empresas = await Empresas.findAll()
    const clavesEmpresas = empresas.map(empresa => {
      return {
        claveEmpresa: empresa.claveEmpresa,
        razonSocial: empresa.nombreEmpresa
      }
    })

    const sucursales = await Sucursales.findAll()

    const sucursalesAgrupadas = clavesEmpresas.map(empresa => {
      const sucursalesEmpresa = sucursales.filter(sucursal => sucursal.claveEmpresa === empresa.claveEmpresa)
      return {
        ...empresa,
        sucursales: sucursalesEmpresa.map(sucursal => {
          return {
            claveSucursal: sucursal.claveSucursal,
            nombreSucursal: sucursal.nombreSucursal
          }
        })
      }
    })

    return res.json(sucursalesAgrupadas)
  } catch (error) {
    return res.status(500).json({ message: 'Error en el sistema.(' + error.message + ')' })
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

export const obtenerDepartamentosSucursales = async (req, res) => {
  try {

    const departamentosSucursales = await DepartamentosSucursales.findAll({ include: [Sucursales, Departamentos] })
    res.json(departamentosSucursales)

  } catch (error) {
    return res.status(500).json({ message: 'Error en el sistema.(' + error.message + ')' })
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
    const { numero_empleado } = req.params

    //Inf. del empleado, cuantas vacaciones, cuantos días econom.
    const informacionEmpleado = await Usuarios.findOne({ where: { numero_empleado: numero_empleado } })

    if (!informacionEmpleado) {
      return res.status(404).json({ message: "Empleado no encontrado" })
    }

    return res.json(informacionEmpleado)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerDetalleEmpleadoYJefeDirecto = async (req, res) => {
  try {
    const { numero_empleado } = req.params

    const [detalleEmpleado] = await db.query(queryObtenerEmpleado(numero_empleado), { type: QueryTypes.SELECT })

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
  const PRORROGA = 7
  try {
    const { numero_empleado } = req.params

    const todasSolicitudes = await Solicitudes.findAll({
      where: {
        numero_empleado: numero_empleado,
        idTipoSolicitud: {
          [Op.ne]: PRORROGA
        }
      },
      include: [
        Usuarios,
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

export const obtenerProrrogasPorEmpleado = async (req, res) => {
  const PRORROGA = 7
  try {
    const { numero_empleado } = req.params

    const todasSolicitudes = await Solicitudes.findAll({
      where: {
        numero_empleado: numero_empleado,
        idTipoSolicitud: PRORROGA
      },
      include: [
        Usuarios,
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

export const obtenerTodasSolicitudes = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body

    const fechaInicioStr = dayjs(fechaInicio).format('YYYY-MM-DD')
    const fechaFinStr = dayjs(fechaFin).format('YYYY-MM-DD')

    const todasSolicitudes = await Solicitudes.findAll({ where: {
      [Op.and]: [
        Sequelize.where(Sequelize.literal(`CAST(solicitudes.createdAt AS DATE)`), {
          [Op.gte]: fechaInicioStr
        }),
        Sequelize.where(Sequelize.literal(`CAST(solicitudes.createdAt AS DATE)`), {
          [Op.lte]: fechaFinStr
        })
      ]
    },
      include: [
        Usuarios,
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

export const obtenerSolicitudPorFolio = async (req, res) => {
  try {
    const { folio } = req.params

    const solicitud = await Solicitudes.findOne({
      where: {
        folio: folio
      },
      include: [
        Usuarios,
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

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" })
    }

    return res.json(solicitud)

  } catch (error) {
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const obtenerDetalleUsuario = async (req, res) => {
  try {
    const { numero_empleado } = req.params

    const [obtenerDetalleUsuario] = await db.query(queryObtenerEmpleado(numero_empleado), { type: QueryTypes.SELECT })

    if (!obtenerDetalleUsuario) {
      return res.status(404).json({ message: "Empleado no encontrado." })
    }

    return res.json(obtenerDetalleUsuario)

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

    const { usuariosAutorizan: { primeraAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos, { transaction: transaccion })

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud }, transaction: transaccion })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const detalles = []

    if ([PASE_ENTRADA, PASE_SALIDA].includes(nuevosDatos.idMotivo)) {
      const detalle = await SolicitudDetalle.create(nuevosDatos, { transaction: transaccion })
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
      const detallesFalta = await SolicitudDetalle.bulkCreate(fechasMapeadas, { transaction: transaccion })
      detalles.push(...detallesFalta)
    }

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      }, { transaction: transaccion })
    }

    await transaccion.commit()
    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        Usuarios,
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

    const { usuariosAutorizan: { primeraAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos, { transaction: transaccion })

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud }, transaction: transaccion })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const fechasMapeadas = nuevosDatos.fechasSeleccionadas.map(fecha => {
      return {
        folio: nuevosDatos.folio,
        fechaDiaSolicitado: fecha,
        idEstatusSolicitud: nuevosDatos.idEstatusSolicitud,
        horaDiaSolicitado: null
      }
    })
    const detalles = await SolicitudDetalle.bulkCreate(fechasMapeadas, { transaction: transaccion })

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      }, { transaction: transaccion })
    }

    await transaccion.commit()

    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        Usuarios,
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

    const { usuariosAutorizan: { primeraAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos, { transaction: transaccion })

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud }, transaction: transaccion })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const fechasMapeadas = nuevosDatos.fechasSeleccionadas.map(fecha => {
      return {
        folio: nuevosDatos.folio,
        fechaDiaSolicitado: fecha,
        idEstatusSolicitud: nuevosDatos.idEstatusSolicitud,
        horaDiaSolicitado: null
      }
    })
    const detalles = await SolicitudDetalle.bulkCreate(fechasMapeadas, { transaction: transaccion })

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      }, { transaction: transaccion })
    }

    await transaccion.commit()

    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        Usuarios,
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

export const solicitarDiasGanados = async (req, res) => {
  const transaccion = await db.transaction()

  try {

    const nuevosDatos = req.body

    const { usuariosAutorizan: { primeraAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos, { transaction: transaccion })

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud }, transaction: transaccion })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const fechasMapeadas = nuevosDatos.fechasSeleccionadas.map(fecha => {
      return {
        folio: nuevosDatos.folio,
        fechaDiaSolicitado: fecha,
        idEstatusSolicitud: nuevosDatos.idEstatusSolicitud,
        horaDiaSolicitado: null
      }
    })
    const detalles = await SolicitudDetalle.bulkCreate(fechasMapeadas, { transaction: transaccion })

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      }, { transaction: transaccion })

    }

    await transaccion.commit()

    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        Usuarios,
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

export const solicitarVacacionesVencidas = async (req, res) => {
  const transaccion = await db.transaction()

  try {

    const nuevosDatos = req.body

    const { usuariosAutorizan: { primeraAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos, { transaction: transaccion })

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud }, transaction: transaccion })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const fechasMapeadas = nuevosDatos.fechasSeleccionadas.map(fecha => {
      return {
        folio: nuevosDatos.folio,
        fechaDiaSolicitado: fecha,
        idEstatusSolicitud: nuevosDatos.idEstatusSolicitud,
        horaDiaSolicitado: null
      }
    })
    const detalles = await SolicitudDetalle.bulkCreate(fechasMapeadas, { transaction: transaccion })

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      }, { transaction: transaccion })
    }

    await transaccion.commit()

    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        Usuarios,
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

export const solicitarSabados5s = async (req, res) => {
  const transaccion = await db.transaction()

  try {

    const nuevosDatos = req.body

    const { usuariosAutorizan: { primeraAutorizacion } } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos, { transaction: transaccion })

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud }, transaction: transaccion })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const fechasMapeadas = nuevosDatos.fechasSeleccionadas.map(fecha => {
      return {
        folio: nuevosDatos.folio,
        fechaDiaSolicitado: fecha,
        idEstatusSolicitud: nuevosDatos.idEstatusSolicitud,
        horaDiaSolicitado: null
      }
    })
    const detalles = await SolicitudDetalle.bulkCreate(fechasMapeadas, { transaction: transaccion })

    for (const detalle of detalles) {
      // Primera autorización jefeDirecto
      await AutorizacionesSolicitudes.create({
        idSolicitudDetalle: detalle.idSolicitudDetalle,
        numeroEmpleadoAutoriza: primeraAutorizacion.numero_empleado,
        nombreEmpleadoAutoriza: primeraAutorizacion.nombre,
        idTipoAutorizacion: 1,
      }, { transaction: transaccion })
    }

    await transaccion.commit()

    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        Usuarios,
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

export const solicitarProrroga = async (req, res) => {
  const transaccion = await db.transaction()

  try {

    const nuevosDatos = req.body

    const { usuarioAutoriza } = nuevosDatos

    const nuevaSolicitud = await Solicitudes.create(nuevosDatos, { transaction: transaccion })

    const { claveSucursal, claveDepartamento, numero_empleado, idSolicitud, createdAt } = nuevaSolicitud

    // Formatear la fecha createdAt
    const fecha = new Date(createdAt)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const dia = fecha.getDate().toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()

    const fechaFormateada = `${dia}${mes}${año}`

    const folio = `${claveSucursal}-${claveDepartamento}-${numero_empleado}-${fechaFormateada}-${idSolicitud}`

    await Solicitudes.update({ folio: folio }, { where: { idSolicitud: idSolicitud }, transaction: transaccion })

    nuevosDatos.idEstatusSolicitud = 1
    nuevosDatos.folio = folio

    const detalle = await SolicitudDetalle.create(nuevosDatos, { transaction: transaccion })

    const { numeroDiasProrroga } = detalle

    await AutorizacionesSolicitudes.create({
      idSolicitudDetalle: detalle.idSolicitudDetalle,
      numeroEmpleadoAutoriza: usuarioAutoriza.numero_empleado,
      nombreEmpleadoAutoriza: usuarioAutoriza.nombre,
      idTipoAutorizacion: 1,
    }, { transaction: transaccion })


    //Inf. del empleado, cuantas vacaciones, cuantos días econom.
    const informacionEmpleado = await Usuarios.findOne({ where: { numero_empleado: numero_empleado } })

    const vacacionesRestantes = informacionEmpleado.diasVacacionesRestantes
    const vacacionesVencidas = informacionEmpleado.vacacionesVencidas

    if (vacacionesRestantes && vacacionesRestantes > 0 && numeroDiasProrroga <= vacacionesRestantes) {
      const nuevasVacacionesRestantes = vacacionesRestantes - numeroDiasProrroga
      const nuevasVacacionesVencidas = vacacionesVencidas + numeroDiasProrroga

      await Usuarios.update(
        { diasVacacionesRestantes: nuevasVacacionesRestantes, vacacionesVencidas: nuevasVacacionesVencidas },
        { where: { numero_empleado: numero_empleado }, transaction: transaccion }
      )
    } else {
      await transaccion.rollback()
      return res.status(400).json({ message: "Error de validación: días insuficientes" })
    }

    await transaccion.commit()

    const solicitudCreada = await Solicitudes.findByPk(nuevaSolicitud.idSolicitud, {
      include: [
        Usuarios,
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

export const actualizarAutorizaciones = async (req, res) => {
  const transaccion = await db.transaction()

  try {

    const autorizaciones = req.body

    for (const autorizacion of autorizaciones) {
      const { idAutorizacion, idEstatusAutorizacion, comentario } = autorizacion
      await AutorizacionesSolicitudes.update(
        { idEstatusAutorizacion: idEstatusAutorizacion, comentario: comentario },
        { where: { idAutorizacion: idAutorizacion }, transaction: transaccion }
      )
    }

    await transaccion.commit()
    return res.json()

  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const finalizarSolicitudAusenciasYRetardos = async (req, res) => {
  const transaccion = await db.transaction()

  const AUTORIZADO = 2
  const RECHAZADO = 3

  try {
    const { folio } = req.params

    const solicitud = await Solicitudes.findOne({
      where: {
        folio: folio
      },
      include: [
        Usuarios,
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

    if (!solicitud) {
      await transaccion.rollback()
      return res.status(404).json({ message: "Solicitud no encontrada" })
    }

    // Filtrar solicitud_detalles autorizados
    const detallesAutorizados = solicitud.solicitud_detalles.filter(detalle => {
      const autorizaciones = detalle.autorizaciones_solicitudes
      const todasAutorizadas = autorizaciones.every(auth => auth.idEstatusAutorizacion === AUTORIZADO)
      const algunaRechazada = autorizaciones.some(auth => auth.idEstatusAutorizacion === RECHAZADO)
      return todasAutorizadas && !algunaRechazada
    })

    // Actualizar el idEstatusSolicitud de cada solicitud_detalle según si se autorizó o no
    for (const detalle of solicitud.solicitud_detalles) {
      const nuevoEstatus = detallesAutorizados.some(autorizado => autorizado.idSolicitudDetalle === detalle.idSolicitudDetalle)
        ? AUTORIZADO
        : RECHAZADO

      await SolicitudDetalle.update(
        { idEstatusSolicitud: nuevoEstatus },
        { where: { idSolicitudDetalle: detalle.idSolicitudDetalle }, transaction: transaccion }
      )
    }

    const fechasAutorizadas = detallesAutorizados.map((detalle) => {
      return detalle.fechaDiaSolicitado
    })

    await transaccion.commit()

    return res.json({ fechasAutorizadas })
  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const finalizarSolicitudVacaciones = async (req, res) => {
  const AUTORIZADO = 2
  const RECHAZADO = 3

  const transaccion = await db.transaction()

  try {
    const { folio } = req.params

    const solicitud = await Solicitudes.findOne({
      where: { folio },
      include: [
        Usuarios,
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

    if (!solicitud) {
      await transaccion.rollback()
      return res.status(404).json({ message: "Solicitud no encontrada" })
    }

    // Filtrar solicitud_detalles autorizados
    const detallesAutorizados = solicitud.solicitud_detalles.filter(detalle => {
      const autorizaciones = detalle.autorizaciones_solicitudes
      const todasAutorizadas = autorizaciones.every(auth => auth.idEstatusAutorizacion === AUTORIZADO)
      const algunaRechazada = autorizaciones.some(auth => auth.idEstatusAutorizacion === RECHAZADO)
      return todasAutorizadas && !algunaRechazada
    })

    // Actualizar el idEstatusSolicitud de cada solicitud_detalle según si está en la lista de autorizados o no
    for (const detalle of solicitud.solicitud_detalles) {
      const nuevoEstatus = detallesAutorizados.some(autorizado => autorizado.idSolicitudDetalle === detalle.idSolicitudDetalle)
        ? AUTORIZADO
        : RECHAZADO

      await SolicitudDetalle.update(
        { idEstatusSolicitud: nuevoEstatus },
        { where: { idSolicitudDetalle: detalle.idSolicitudDetalle }, transaction: transaccion }
      )
    }

    // Obtener la información del empleado
    const informacionEmpleado = await Usuarios.findOne({
      where: { numero_empleado: solicitud.numero_empleado }
    })

    const numeroDiasAutorizados = detallesAutorizados.length
    const diasVacacionesDisponibles = informacionEmpleado.diasVacacionesRestantes

    const fechasAutorizadas = detallesAutorizados.map(detalle => detalle.fechaDiaSolicitado)
    const fechaDeSolicitud = dayjs(solicitud.createdAt)

    // Para obtener la fecha de aniversario
    const fechaAlta = dayjs(informacionEmpleado.fechaAlta)
    const anioActual = dayjs().year()
    const fechaAniversario = fechaAlta.year(anioActual)

    const fechaAutorizacion = detallesAutorizados && detallesAutorizados.length > 0
      ? dayjs(detallesAutorizados[0].autorizaciones_solicitudes[0].createdAt)
      : null

    const solicitudAntesAniversario = fechaDeSolicitud.isBefore(fechaAniversario)
    const autorizacionDespuesAniversario = fechaAutorizacion && fechaAutorizacion.isAfter(fechaAniversario)

    // Descuenta los días autorizados del número de días disponibles del empleado si no aplica la condición
    if (numeroDiasAutorizados > 0) {
      if (diasVacacionesDisponibles > 0 && numeroDiasAutorizados <= diasVacacionesDisponibles) {

        // si la solicitud es antes del aniversario y la autorización es después del aniversario, termina y no realiza el descuento de días
        if (solicitudAntesAniversario && autorizacionDespuesAniversario) {
          await transaccion.commit()
          return res.json({ fechasAutorizadas })
        }

        const diasRestantesActualizados = diasVacacionesDisponibles - numeroDiasAutorizados
        await Usuarios.update(
          { diasVacacionesRestantes: diasRestantesActualizados },
          { where: { numero_empleado: solicitud.numero_empleado }, transaction: transaccion }
        )
        await transaccion.commit()
        return res.json({ fechasAutorizadas })
      } else {
        await transaccion.rollback()
        return res.status(400).json({ message: "Error de validación al aplicar los días autorizados: días insuficientes" })
      }
    } else {
      await transaccion.commit()
      return res.json({ fechasAutorizadas })
    }
  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const finalizarSolicitudDiasEconomicos = async (req, res) => {
  const AUTORIZADO = 2
  const RECHAZADO = 3

  const transaccion = await db.transaction()

  try {
    const { folio } = req.params

    const solicitud = await Solicitudes.findOne({
      where: {
        folio: folio
      },
      include: [
        Usuarios,
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

    if (!solicitud) {
      await transaccion.rollback()
      return res.status(404).json({ message: "Solicitud no encontrada" })
    }

    // Filtrar solicitud_detalles autorizados
    const detallesAutorizados = solicitud.solicitud_detalles.filter(detalle => {
      const autorizaciones = detalle.autorizaciones_solicitudes
      const todasAutorizadas = autorizaciones.every(auth => auth.idEstatusAutorizacion === AUTORIZADO)
      const algunaRechazada = autorizaciones.some(auth => auth.idEstatusAutorizacion === RECHAZADO)
      return todasAutorizadas && !algunaRechazada
    })

    // Actualizar el idEstatusAutorizacion de cada solicitud_detalle según si se autorizó o no
    for (const detalle of solicitud.solicitud_detalles) {
      if (detallesAutorizados.some(autorizado => autorizado.idSolicitudDetalle === detalle.idSolicitudDetalle)) {
        await SolicitudDetalle.update(
          { idEstatusSolicitud: AUTORIZADO },
          { where: { idSolicitudDetalle: detalle.idSolicitudDetalle }, transaction: transaccion }
        )
      } else {
        await SolicitudDetalle.update(
          { idEstatusSolicitud: RECHAZADO },
          { where: { idSolicitudDetalle: detalle.idSolicitudDetalle }, transaction: transaccion }
        )
      }
    }

    // Obtener la información del empleado
    const informacionEmpleado = await Usuarios.findOne({
      where: { numero_empleado: solicitud.numero_empleado },
      transaction: transaccion
    })

    const numeroDiasAutorizados = detallesAutorizados.length
    const diasEconomicosDisponibles = informacionEmpleado.diasEconomicosRestantes

    const fechasAutorizadas = detallesAutorizados.map((detalle) => {
      return detalle.fechaDiaSolicitado
    })

    // Descuenta los días autorizados del número de días disponibles del empleado
    if (numeroDiasAutorizados > 0) {
      if (diasEconomicosDisponibles > 0 && numeroDiasAutorizados <= diasEconomicosDisponibles) {
        const diasRestantesActualizados = diasEconomicosDisponibles - numeroDiasAutorizados
        await Usuarios.update(
          { diasEconomicosRestantes: diasRestantesActualizados },
          { where: { numero_empleado: solicitud.numero_empleado }, transaction: transaccion }
        )
        await transaccion.commit()
        return res.json({ fechasAutorizadas })
      } else {
        await transaccion.rollback()
        return res.status(400).json({ message: "Error de validación al aplicar los días autorizados: días insuficientes" })
      }
    } else {
      await transaccion.commit()
      return res.json({ fechasAutorizadas })
    }
  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const finalizarSolicitudDiasGanados = async (req, res) => {
  const AUTORIZADO = 2
  const RECHAZADO = 3

  const transaccion = await db.transaction()

  try {
    const { folio } = req.params

    const solicitud = await Solicitudes.findOne({
      where: {
        folio: folio
      },
      include: [
        Usuarios,
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
      ]
    })

    if (!solicitud) {
      await transaccion.rollback()
      return res.status(404).json({ message: "Solicitud no encontrada" })
    }

    // Filtrar solicitud_detalles autorizados
    const detallesAutorizados = solicitud.solicitud_detalles.filter(detalle => {
      const autorizaciones = detalle.autorizaciones_solicitudes
      const todasAutorizadas = autorizaciones.every(auth => auth.idEstatusAutorizacion === AUTORIZADO)
      const algunaRechazada = autorizaciones.some(auth => auth.idEstatusAutorizacion === RECHAZADO)
      return todasAutorizadas && !algunaRechazada
    })

    // Actualizar el idEstatusSolicitud de cada solicitud_detalle según si se est+a en la lista de autorizados o no
    for (const detalle of solicitud.solicitud_detalles) {
      const nuevoEstatus = detallesAutorizados.some(autorizado => autorizado.idSolicitudDetalle === detalle.idSolicitudDetalle)
        ? AUTORIZADO
        : RECHAZADO

      await SolicitudDetalle.update(
        { idEstatusSolicitud: nuevoEstatus },
        { where: { idSolicitudDetalle: detalle.idSolicitudDetalle }, transaction: transaccion }
      )
    }

    // Obtener la información del empleado
    const informacionEmpleado = await Usuarios.findOne({
      where: { numero_empleado: solicitud.numero_empleado }
    })

    const numeroDiasAutorizados = detallesAutorizados.length
    const diasGanados = informacionEmpleado.diasGanados

    const fechasAutorizadas = detallesAutorizados.map((detalle) => {
      return detalle.fechaDiaSolicitado
    })

    // Descuenta los días autorizados del número de días disponibles del empleado
    if (numeroDiasAutorizados > 0) {
      if (diasGanados > 0 && numeroDiasAutorizados <= diasGanados) {
        const diasRestantesActualizados = diasGanados - numeroDiasAutorizados
        await Usuarios.update(
          { diasGanados: diasRestantesActualizados },
          { where: { numero_empleado: solicitud.numero_empleado }, transaction: transaccion }
        )
        await transaccion.commit()
        return res.json({ fechasAutorizadas })
      } else {
        await transaccion.rollback()
        return res.status(400).json({ message: "Error de validación al aplicar los días autorizados: días insuficientes" })
      }
    } else {
      await transaccion.commit()
      return res.json({ fechasAutorizadas })
    }
  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const finalizarSolicitudVacacionesVencidas = async (req, res) => {
  const AUTORIZADO = 2
  const RECHAZADO = 3

  const transaccion = await db.transaction()

  try {
    const { folio } = req.params

    const solicitud = await Solicitudes.findOne({
      where: {
        folio: folio
      },
      include: [
        Usuarios,
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
      ]
    })

    if (!solicitud) {
      await transaccion.rollback()
      return res.status(404).json({ message: "Solicitud no encontrada" })
    }

    // Filtrar solicitud_detalles autorizados
    const detallesAutorizados = solicitud.solicitud_detalles.filter(detalle => {
      const autorizaciones = detalle.autorizaciones_solicitudes
      const todasAutorizadas = autorizaciones.every(auth => auth.idEstatusAutorizacion === AUTORIZADO)
      const algunaRechazada = autorizaciones.some(auth => auth.idEstatusAutorizacion === RECHAZADO)
      return todasAutorizadas && !algunaRechazada
    })

    // Actualizar el idEstatusSolicitud de cada solicitud_detalle según si se est+a en la lista de autorizados o no
    for (const detalle of solicitud.solicitud_detalles) {
      const nuevoEstatus = detallesAutorizados.some(autorizado => autorizado.idSolicitudDetalle === detalle.idSolicitudDetalle)
        ? AUTORIZADO
        : RECHAZADO

      await SolicitudDetalle.update(
        { idEstatusSolicitud: nuevoEstatus },
        { where: { idSolicitudDetalle: detalle.idSolicitudDetalle }, transaction: transaccion }
      )
    }

    // Obtener la información del empleado
    const informacionEmpleado = await Usuarios.findOne({
      where: { numero_empleado: solicitud.numero_empleado }
    })

    const numeroDiasAutorizados = detallesAutorizados.length
    const vacacionesVencidasRestantes = informacionEmpleado.vacacionesVencidasRestantes

    const fechasAutorizadas = detallesAutorizados.map((detalle) => {
      return detalle.fechaDiaSolicitado
    })

    // Descuenta los días autorizados del número de días disponibles del empleado
    if (numeroDiasAutorizados > 0) {
      if (vacacionesVencidasRestantes > 0 && numeroDiasAutorizados <= vacacionesVencidasRestantes) {
        const diasRestantesActualizados = vacacionesVencidasRestantes - numeroDiasAutorizados
        await Usuarios.update(
          { vacacionesVencidasRestantes: diasRestantesActualizados },
          { where: { numero_empleado: solicitud.numero_empleado }, transaction: transaccion }
        )
        await transaccion.commit()
        return res.json({ fechasAutorizadas })
      } else {
        await transaccion.rollback()
        return res.status(400).json({ message: "Error de validación al aplicar los días autorizados: días insuficientes" })
      }
    } else {
      await transaccion.commit()
      return res.json({ fechasAutorizadas })
    }
  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const finalizarSolicitudSabados5s = async (req, res) => {
  const AUTORIZADO = 2
  const RECHAZADO = 3

  const transaccion = await db.transaction()

  try {
    const { folio } = req.params

    const solicitud = await Solicitudes.findOne({
      where: {
        folio: folio
      },
      include: [
        Usuarios,
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
      ]
    })

    if (!solicitud) {
      await transaccion.rollback()
      return res.status(404).json({ message: "Solicitud no encontrada" })
    }

    // Filtrar solicitud_detalles autorizados
    const detallesAutorizados = solicitud.solicitud_detalles.filter(detalle => {
      const autorizaciones = detalle.autorizaciones_solicitudes
      const todasAutorizadas = autorizaciones.every(auth => auth.idEstatusAutorizacion === AUTORIZADO)
      const algunaRechazada = autorizaciones.some(auth => auth.idEstatusAutorizacion === RECHAZADO)
      return todasAutorizadas && !algunaRechazada
    })

    // Actualizar el idEstatusSolicitud de cada solicitud_detalle según si se est+a en la lista de autorizados o no
    for (const detalle of solicitud.solicitud_detalles) {
      const nuevoEstatus = detallesAutorizados.some(autorizado => autorizado.idSolicitudDetalle === detalle.idSolicitudDetalle)
        ? AUTORIZADO
        : RECHAZADO

      await SolicitudDetalle.update(
        { idEstatusSolicitud: nuevoEstatus },
        { where: { idSolicitudDetalle: detalle.idSolicitudDetalle }, transaction: transaccion }
      )
    }

    // Obtener la información del empleado
    const informacionEmpleado = await Usuarios.findOne({
      where: { numero_empleado: solicitud.numero_empleado }
    })

    const numeroDiasAutorizados = detallesAutorizados.length
    const sabados5s = informacionEmpleado.sabados5s

    const fechasAutorizadas = detallesAutorizados.map((detalle) => {
      return detalle.fechaDiaSolicitado
    })

    // Descuenta los días autorizados del número de días disponibles del empleado
    if (numeroDiasAutorizados > 0) {
      if (sabados5s > 0 && numeroDiasAutorizados <= sabados5s) {
        const diasRestantesActualizados = sabados5s - numeroDiasAutorizados
        await Usuarios.update(
          { sabados5s: diasRestantesActualizados },
          { where: { numero_empleado: solicitud.numero_empleado }, transaction: transaccion }
        )
        await transaccion.commit()
        return res.json({ fechasAutorizadas })
      } else {
        await transaccion.rollback()
        return res.status(400).json({ message: "Error de validación al aplicar los días autorizados: días insuficientes" })
      }
    } else {
      await transaccion.commit()
      return res.json({ fechasAutorizadas })
    }
  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}

export const finalizarSolicitudProrroga = async (req, res) => {
  const AUTORIZADO = 2
  const RECHAZADO = 3

  const transaccion = await db.transaction()

  try {
    const { folio } = req.params

    const solicitud = await Solicitudes.findOne({
      where: {
        folio: folio
      },
      include: [
        Usuarios,
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
      ]
    })

    if (!solicitud) {
      await transaccion.rollback()
      return res.status(404).json({ message: "Solicitud no encontrada" })
    }

    // Filtrar solicitud_detalles autorizados
    const detallesAutorizados = solicitud.solicitud_detalles.filter(detalle => {
      const autorizaciones = detalle.autorizaciones_solicitudes
      const todasAutorizadas = autorizaciones.every(auth => auth.idEstatusAutorizacion === AUTORIZADO)
      const algunaRechazada = autorizaciones.some(auth => auth.idEstatusAutorizacion === RECHAZADO)
      return todasAutorizadas && !algunaRechazada
    })

    // Actualizar el idEstatusSolicitud de cada solicitud_detalle según si se est+a en la lista de autorizados o no
    for (const detalle of solicitud.solicitud_detalles) {
      const nuevoEstatus = detallesAutorizados.some(autorizado => autorizado.idSolicitudDetalle === detalle.idSolicitudDetalle)
        ? AUTORIZADO
        : RECHAZADO

      await SolicitudDetalle.update(
        { idEstatusSolicitud: nuevoEstatus },
        { where: { idSolicitudDetalle: detalle.idSolicitudDetalle }, transaction: transaccion }
      )
    }

    const { numeroDiasProrroga } = solicitud.solicitud_detalles[0]

    // Obtener la información del empleado
    const informacionEmpleado = await Usuarios.findOne({
      where: { numero_empleado: solicitud.numero_empleado }
    })

    const diasVencidosRestantes = informacionEmpleado.vacacionesVencidasRestantes
    const vacacionesRestantes = informacionEmpleado.diasVacacionesRestantes
    const vacacionesVencidas = informacionEmpleado.vacacionesVencidas

    // si autoriza entonces SUMA a diasVacacionesVencidosRestantes
    if (detallesAutorizados && detallesAutorizados.length > 0) {
      const nuevosDiasVencidosRestantes = diasVencidosRestantes + numeroDiasProrroga

      await Usuarios.update(
        { vacacionesVencidasRestantes: nuevosDiasVencidosRestantes },
        { where: { numero_empleado: solicitud.numero_empleado }, transaction: transaccion }
      )

      await transaccion.commit()
      return res.json(true)
    } else {
      // sino SUMA a vacacionesRestantes y RESTA a diasVacacionesVencidos
      const nuevasVacacionesRestantes = vacacionesRestantes + numeroDiasProrroga
      const nuevasVacacionesVencidas = vacacionesVencidas - numeroDiasProrroga
      await Usuarios.update(
        { diasVacacionesRestantes: nuevasVacacionesRestantes, vacacionesVencidas: nuevasVacacionesVencidas },
        { where: { numero_empleado: solicitud.numero_empleado }, transaction: transaccion }
      )

      await transaccion.commit()
      return res.json(false)
    }

  } catch (error) {
    await transaccion.rollback()
    return res.status(500).json({ message: `Error en el sistema: ${error.message}` })
  }
}