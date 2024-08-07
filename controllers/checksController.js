import { QueryTypes } from 'sequelize'
import db from '../config/db.js'
import dayjs from 'dayjs'
import { parse, isBefore } from 'date-fns'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import CatalogoTurnos from '../models/CatalogoTurnos.js'
import { queryChecks, queryChecksUsuario, querySolicitudesJustificantes, querySolicitudesJustificantesUsuario } from '../constant/querys.js'

export const obtenerChecks = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, numero_empleado } = req.body
    dayjs.extend(weekOfYear)

    let todoschecks
    if (!numero_empleado) {
      todoschecks = await db.query(queryChecks(fechaInicio, fechaFin), { type: QueryTypes.SELECT })
    } else {
      todoschecks = await db.query(queryChecksUsuario(fechaInicio, fechaFin, numero_empleado), { type: QueryTypes.SELECT })
    }

    let todosSolicitudes
    if (!numero_empleado) {
      todosSolicitudes = await db.query(querySolicitudesJustificantes(fechaInicio, fechaFin), { type: QueryTypes.SELECT })
    } else {
      todosSolicitudes = await db.query(querySolicitudesJustificantesUsuario(fechaInicio, fechaFin, numero_empleado), { type: QueryTypes.SELECT })
    }

    const turnosEspeciales = await CatalogoTurnos.findAll({ where: { turnoEspecial: 1 } })

    const checksMap = new Map()
    for (const check of todoschecks) {
      const semana = dayjs(check.fechaRegistro).week()
      const key = `${check.numero_empleado}-${semana}-${check.fechaRegistro}`

      if (!checksMap.has(key)) {
        checksMap.set(key, check)
      }
    }

    const diasEnRango = await obtenerDiasEnRango(fechaInicio, fechaFin)

    const resultados = Array.from(checksMap.values()).reduce((acc, check) => {
      const usuarioId = check.numero_empleado
      const semana = dayjs(check.fechaRegistro).week()
      const turnoEspecialSemana = turnosEspeciales.filter(elemento => elemento.turno === check.turnoLunesViernes)
      const turnoEspecialSabado = turnosEspeciales.filter(elemento => elemento.turno === check.turnoSabados)

      if (!acc[usuarioId]) {
        acc[usuarioId] = {
          numero_empleado: check.numero_empleado,
          nombre: check.nombre,
          fechaAlta: check.fechaAlta,
          aniosLaborados: check.aniosLaborados,
          diasVacacionesLey: check.diasVacacionesLey,
          diasVacacionesRestantes: check.diasVacacionesRestantes,
          diasEconomicosLey: check.diasEconomicosLey,
          diasEconomicosRestantes: check.diasEconomicosRestantes,
          puesto: check.puesto,
          division: check.division,
          departamento: check.departamento,
          centroTrabajo: check.centroTrabajo,
          claveEmpresa: check.claveEmpresa,
          claveSucursal: check.claveSucursal,
          claveDepartamento: check.claveDepartamento,
          numeroEmpleadoJefe: check.numeroEmpleadoJefe,
          estatus: check.estatus,
          turnoLunesViernes: check.turnoLunesViernes,
          turnoSabados: check.turnoSabados,
          createdAt: check.createdAt,
          updatedAt: check.updatedAt,
          semanas: {}
        }
      }

      if (!acc[usuarioId].semanas[semana]) {
        acc[usuarioId].semanas[semana] = {
          lunes: {},
          martes: {},
          miercoles: {},
          jueves: {},
          viernes: {},
          sabado: {}
        }
      }

      if (check.fechaRegistro) {
        const fechaRegistro = check.fechaRegistro
        const diaSemana = dayjs(fechaRegistro).day()
        const horaRegistro = check.horaRegistro

        let horaTurno, sinTurno = false
        if (diaSemana === 6) {
          if (!check.turnoSabados) {
            sinTurno = true
          } else {
            horaTurno = parse(check.turnoSabados.replace('TURNO ', '').split(" - ")[0], 'HH:mm', new Date())
          }
        } else {
          if (!check.turnoLunesViernes) {
            sinTurno = true
          } else {
            horaTurno = parse(check.turnoLunesViernes.replace('TURNO ', '').split(" - ")[0], 'HH:mm', new Date())
          }
        }

        const horaEntrada = parse(check.horaRegistro, 'HH:mm', new Date())
        let retardo = false
        if (!sinTurno) {
          retardo = isBefore(horaTurno, horaEntrada)
        }

        switch (diaSemana) {
          case 1:
            acc[usuarioId].semanas[semana].lunes = { fechaRegistro, horaRegistro, retardo, sinTurno }
            break
          case 2:
            acc[usuarioId].semanas[semana].martes = { fechaRegistro, horaRegistro, retardo, sinTurno }
            break
          case 3:
            acc[usuarioId].semanas[semana].miercoles = { fechaRegistro, horaRegistro, retardo, sinTurno }
            break
          case 4:
            acc[usuarioId].semanas[semana].jueves = { fechaRegistro, horaRegistro, retardo, sinTurno }
            break
          case 5:
            acc[usuarioId].semanas[semana].viernes = { fechaRegistro, horaRegistro, retardo, sinTurno }
            break
          case 6:
            acc[usuarioId].semanas[semana].sabado = { fechaRegistro, horaRegistro, retardo, sinTurno }
            break
          default:
            break
        }
      }

      acc[usuarioId].turnoEspecialSemana = turnoEspecialSemana[0]
      acc[usuarioId].turnoEspecialSabado = turnoEspecialSabado[0]

      return acc
    }, {})

    // Agregar los días en el rango al resultado
    Object.keys(resultados).forEach(usuarioId => {
      const semanas = resultados[usuarioId].semanas
      diasEnRango.forEach(dia => {
        const semana = dayjs(dia.fecha).week()
        const diaSemana = dayjs(dia.fecha).day()

        if (!semanas[semana]) {
          semanas[semana] = {
            lunes: {},
            martes: {},
            miercoles: {},
            jueves: {},
            viernes: {},
            sabado: {}
          }
        }

        const diaStr = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][diaSemana]
        if (!semanas[semana][diaStr].fechaRegistro) {
          semanas[semana][diaStr] = { fechaRegistro: dia.fecha }
        }
      })
    })

    // Agregar solicitudes a los días correspondientes
    todosSolicitudes.forEach((solicitud) => {
      const usuarioId = solicitud.numero_empleado
      const fechaSolicitud = solicitud.fechaDiaSolicitado
      const semana = dayjs(fechaSolicitud).week()
      const diaSemana = dayjs(fechaSolicitud).day()

      if (!resultados[usuarioId]) {
        resultados[usuarioId] = {
          numero_empleado: solicitud.numero_empleado,
          nombre: solicitud.nombre,
          fechaAlta: solicitud.fechaAlta,
          aniosLaborados: solicitud.aniosLaborados,
          diasVacacionesLey: solicitud.diasVacacionesLey,
          diasVacacionesRestantes: solicitud.diasVacacionesRestantes,
          diasEconomicosLey: solicitud.diasEconomicosLey,
          diasEconomicosRestantes: solicitud.diasEconomicosRestantes,
          puesto: solicitud.puesto,
          division: solicitud.division,
          departamento: solicitud.departamento,
          centroTrabajo: solicitud.centroTrabajo,
          claveSucursal: solicitud.claveSucursal,
          numeroEmpleadoJefe: solicitud.numeroEmpleadoJefe,
          estatus: solicitud.estatus,
          turnoLunesViernes: solicitud.turnoLunesViernes,
          turnoSabados: solicitud.turnoSabados,
          createdAt: solicitud.createdAt,
          updatedAt: solicitud.updatedAt,
          semanas: {}
        }
      }

      if (!resultados[usuarioId].semanas[semana]) {
        resultados[usuarioId].semanas[semana] = {
          lunes: {},
          martes: {},
          miercoles: {},
          jueves: {},
          viernes: {},
          sabado: {}
        }
      }

      const dia = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][diaSemana]
      if (!resultados[usuarioId].semanas[semana][dia]) {
        resultados[usuarioId].semanas[semana][dia] = {}
      }
      resultados[usuarioId].semanas[semana][dia].solicitud = solicitud
    })

    const arrayResultados = Object.values(resultados)
    return res.json(arrayResultados)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

export const obtenerFaltas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body
    const diasEnRango = await obtenerDiasEnRango(fechaInicio, fechaFin)
    const usuarios = await procesarDatos(fechaInicio, fechaFin, diasEnRango)
    return res.json(usuarios)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

const obtenerDiasEnRango = async (fechaInicio, fechaFin) => {
  const start = dayjs(fechaInicio)
  const end = dayjs(fechaFin)
  const diasEnRango = []

  for (let date = start; date.isBefore(end) || date.isSame(end); date = date.add(1, 'day')) {
    if (date.day() !== 0) {
      diasEnRango.push({
        fecha: date.format('YYYY-MM-DD'),
        diaSemana: date.format('dddd')
      })
    }
  }
  return diasEnRango
}

const procesarDatos = async (fechaInicio, fechaFin, diasEnRango) => {
  try {
    const [todoschecks, todosSolicitudes, turnosEspeciales] = await Promise.all([
      db.query(queryChecks(fechaInicio, fechaFin), { type: QueryTypes.SELECT }),
      db.query(querySolicitudesJustificantes(fechaInicio, fechaFin), { type: QueryTypes.SELECT }),
      CatalogoTurnos.findAll({ where: { turnoEspecial: 1 } })
    ])

    const usuariosMap = new Map()

    // Procesar los checks
    todoschecks.forEach(check => {
      if (!usuariosMap.has(check.numero_empleado)) {
        usuariosMap.set(check.numero_empleado, {
          numero_empleado: check.numero_empleado,
          nombre: check.nombre,
          fechaAlta: check.fechaAlta,
          aniosLaborados: check.aniosLaborados,
          diasVacacionesLey: check.diasVacacionesLey,
          diasVacacionesRestantes: check.diasVacacionesRestantes,
          diasEconomicosLey: check.diasEconomicosLey,
          diasEconomicosRestantes: check.diasEconomicosRestantes,
          puesto: check.puesto,
          division: check.division,
          departamento: check.departamento,
          centroTrabajo: check.centroTrabajo,
          claveEmpresa: check.claveEmpresa,
          claveSucursal: check.claveSucursal,
          claveDepartamento: check.claveDepartamento,
          numeroEmpleadoJefe: check.numeroEmpleadoJefe,
          estatus: check.estatus,
          turnoLunesViernes: check.turnoLunesViernes,
          turnoSabados: check.turnoSabados,
          createdAt: check.createdAt,
          updatedAt: check.updatedAt,
          faltas: 0,
          asistencias: 0,
          justificantes: 0,
          fechaFaltas: [],
          fechaAsistencias: [],
          fechasProcesadas: new Set()
        })
      }

      const usuario = usuariosMap.get(check.numero_empleado)
      const fechaRegistro = check.fechaRegistro

      if (fechaRegistro && !usuario.fechasProcesadas.has(fechaRegistro)) {
        usuario.asistencias += 1
        usuario.fechaAsistencias.push(fechaRegistro)
        usuario.fechasProcesadas.add(fechaRegistro)
      }
    })

    // Procesar las solicitudes
    todosSolicitudes.forEach(solicitud => {
      const usuarioId = solicitud.numero_empleado
      const fechaSolicitud = solicitud.fechaDiaSolicitado

      if (!usuariosMap.has(usuarioId)) {
        usuariosMap.set(usuarioId, {
          numero_empleado: solicitud.numero_empleado,
          nombre: solicitud.nombre,
          fechaAlta: solicitud.fechaAlta,
          aniosLaborados: solicitud.aniosLaborados,
          diasVacacionesLey: solicitud.diasVacacionesLey,
          diasVacacionesRestantes: solicitud.diasVacacionesRestantes,
          diasEconomicosLey: solicitud.diasEconomicosLey,
          diasEconomicosRestantes: solicitud.diasEconomicosRestantes,
          puesto: solicitud.puesto,
          division: solicitud.division,
          departamento: solicitud.departamento,
          centroTrabajo: solicitud.centroTrabajo,
          claveEmpresa: solicitud.claveEmpresa,
          claveSucursal: solicitud.claveSucursal,
          claveDepartamento: solicitud.claveDepartamento,
          numeroEmpleadoJefe: solicitud.numeroEmpleadoJefe,
          estatus: solicitud.estatus,
          turnoLunesViernes: solicitud.turnoLunesViernes,
          turnoSabados: solicitud.turnoSabados,
          createdAt: solicitud.createdAt,
          updatedAt: solicitud.updatedAt,
          faltas: 0,
          asistencias: 0,
          justificantes: 0,
          fechaFaltas: [],
          fechaAsistencias: [],
          fechasProcesadas: new Set()
        })
      }

      const usuario = usuariosMap.get(usuarioId)

      if (fechaSolicitud && !usuario.fechasProcesadas.has(fechaSolicitud)) {
        usuario.asistencias += 1
        usuario.fechaAsistencias.push(fechaSolicitud)
        usuario.fechasProcesadas.add(fechaSolicitud)
      }
    })

    // Agregar las fechas de faltas y manejar turnos especiales
    usuariosMap.forEach(usuario => {
      const tieneTurnoEspecialSemana = turnosEspeciales.some(turno => turno.turno === usuario.turnoLunesViernes)
      const tieneTurnoEspecialSabado = turnosEspeciales.some(turno => turno.turno === usuario.turnoSabados)

      diasEnRango.forEach(dia => {
        const esSabado = dayjs(dia.fecha).day() === 6

        if (tieneTurnoEspecialSemana || (tieneTurnoEspecialSabado && esSabado)) {
          if (!usuario.fechaAsistencias.includes(dia.fecha) && !usuario.fechasProcesadas.has(dia.fecha)) {
            usuario.asistencias += 1
            usuario.fechaAsistencias.push(dia.fecha)
            usuario.fechasProcesadas.add(dia.fecha)
          }
        } else {
          if (!usuario.fechaAsistencias.includes(dia.fecha)) {
            usuario.faltas += 1
            usuario.fechaFaltas.push(dia.fecha)
          }
        }
      })

      usuario.fechaDeFaltas = usuario.fechaFaltas.join(', ')
    })
    
    const usuariosConFaltas = Array.from(usuariosMap.values()).filter(usuario => usuario.faltas > 0)
    
    return usuariosConFaltas
  } catch (error) {
    throw error
  }
}

