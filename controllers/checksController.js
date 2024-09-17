import { QueryTypes, Op } from 'sequelize'
import db from '../config/db.js'
import dayjs from 'dayjs'
import { parse, isBefore } from 'date-fns'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import CatalogoTurnos from '../models/CatalogoTurnos.js'
import { queryChecks, queryChecksEmpresa, queryChecksUsuario, queryidUsuariosContpaq, queryIncapacidades, queryIncapacidadesEmpresa, queryIncapacidadesUsuario, querySolicitudesJustificantes, querySolicitudesJustificantesEmpresa, querySolicitudesJustificantesUsuario } from '../constant/querys.js'
import Empresas from '../models/Empresas.js'
import DiasFeriados from '../models/DiasFeriados.js'

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

    let todosIncapacidades
    if (!numero_empleado) {
      todosIncapacidades = await db.query(queryIncapacidades(fechaInicio, fechaFin), { type: QueryTypes.SELECT })
    } else {
      todosIncapacidades = await db.query(queryIncapacidadesUsuario(fechaInicio, fechaFin, numero_empleado), { type: QueryTypes.SELECT })
    }

    const diasFeriados = await DiasFeriados.findAll({where: {fecha: {[Op.between]: [fechaInicio, fechaFin]}}})
    
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

        const diaFeriado = diasFeriados.find((feriado) => dayjs(feriado.fecha).isSame(dayjs(dia.fecha), 'day'))
        if (diaFeriado) {
          semanas[semana][diaStr].diaFeriado = diaFeriado
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

      // Agregar incapacidades a los días correspondientes
      todosIncapacidades.forEach((incapacidad) => {
        const usuarioId = incapacidad.numero_empleado
        const fechaIncapacidad = incapacidad.fechaIncapacidad
        const semana = dayjs(fechaIncapacidad).week()
        const diaSemana = dayjs(fechaIncapacidad).day()
  
        if (!resultados[usuarioId]) {
          resultados[usuarioId] = {
            numero_empleado: incapacidad.numero_empleado,
            nombre: incapacidad.nombre,
            fechaAlta: incapacidad.fechaAlta,
            aniosLaborados: incapacidad.aniosLaborados,
            diasVacacionesLey: incapacidad.diasVacacionesLey,
            diasVacacionesRestantes: incapacidad.diasVacacionesRestantes,
            diasEconomicosLey: incapacidad.diasEconomicosLey,
            diasEconomicosRestantes: incapacidad.diasEconomicosRestantes,
            puesto: incapacidad.puesto,
            division: incapacidad.division,
            departamento: incapacidad.departamento,
            centroTrabajo: incapacidad.centroTrabajo,
            claveSucursal: incapacidad.claveSucursal,
            numeroEmpleadoJefe: incapacidad.numeroEmpleadoJefe,
            estatus: incapacidad.estatus,
            turnoLunesViernes: incapacidad.turnoLunesViernes,
            turnoSabados: incapacidad.turnoSabados,
            createdAt: incapacidad.createdAt,
            updatedAt: incapacidad.updatedAt,
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
        resultados[usuarioId].semanas[semana][dia].incapacidad = incapacidad
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
    const [todoschecks, todosSolicitudes, todosIncapacidades, turnosEspeciales, diasFeriados] = await Promise.all([
      db.query(queryChecks(fechaInicio, fechaFin), { type: QueryTypes.SELECT }),
      db.query(querySolicitudesJustificantes(fechaInicio, fechaFin), { type: QueryTypes.SELECT }),
      db.query(queryIncapacidades(fechaInicio, fechaFin), { type: QueryTypes.SELECT }),
      CatalogoTurnos.findAll({ where: { turnoEspecial: 1 } }),
      DiasFeriados.findAll({where: {fecha: {[Op.between]: [fechaInicio, fechaFin],},},})
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

     // Procesar las incapacidades
     todosIncapacidades.forEach(incapacidad => {
      const usuarioId = incapacidad.numero_empleado
      const fechaIncapacidad = incapacidad.fechaIncapacidad

      if (!usuariosMap.has(usuarioId)) {
        usuariosMap.set(usuarioId, {
          numero_empleado: incapacidad.numero_empleado,
          nombre: incapacidad.nombre,
          fechaAlta: incapacidad.fechaAlta,
          aniosLaborados: incapacidad.aniosLaborados,
          diasVacacionesLey: incapacidad.diasVacacionesLey,
          diasVacacionesRestantes: incapacidad.diasVacacionesRestantes,
          diasEconomicosLey: incapacidad.diasEconomicosLey,
          diasEconomicosRestantes: incapacidad.diasEconomicosRestantes,
          puesto: incapacidad.puesto,
          division: incapacidad.division,
          departamento: incapacidad.departamento,
          centroTrabajo: incapacidad.centroTrabajo,
          claveEmpresa: incapacidad.claveEmpresa,
          claveSucursal: incapacidad.claveSucursal,
          claveDepartamento: incapacidad.claveDepartamento,
          numeroEmpleadoJefe: incapacidad.numeroEmpleadoJefe,
          estatus: incapacidad.estatus,
          turnoLunesViernes: incapacidad.turnoLunesViernes,
          turnoSabados: incapacidad.turnoSabados,
          createdAt: incapacidad.createdAt,
          updatedAt: incapacidad.updatedAt,
          faltas: 0,
          asistencias: 0,
          justificantes: 0,
          fechaFaltas: [],
          fechaAsistencias: [],
          fechasProcesadas: new Set()
        })
      }

      const usuario = usuariosMap.get(usuarioId)

      if (fechaIncapacidad && !usuario.fechasProcesadas.has(fechaIncapacidad)) {
        usuario.asistencias += 1
        usuario.fechaAsistencias.push(fechaIncapacidad)
        usuario.fechasProcesadas.add(fechaIncapacidad)
      }
    })

    // Agregar las fechas de faltas y manejar turnos especiales
    usuariosMap.forEach(usuario => {
      const tieneTurnoEspecialSemana = turnosEspeciales.some(turno => turno.turno === usuario.turnoLunesViernes)
      const tieneTurnoEspecialSabado = turnosEspeciales.some(turno => turno.turno === usuario.turnoSabados)

      diasEnRango.forEach(dia => {
        const esSabado = dayjs(dia.fecha).day() === 6
        const esDiaFeriado = diasFeriados.some(
          (feriado) => feriado.fecha === dia.fecha
        )

        if (tieneTurnoEspecialSemana || (tieneTurnoEspecialSabado && esSabado)) {
          if (!usuario.fechaAsistencias.includes(dia.fecha) && !usuario.fechasProcesadas.has(dia.fecha)) {
            usuario.asistencias += 1
            usuario.fechaAsistencias.push(dia.fecha)
            usuario.fechasProcesadas.add(dia.fecha)
          }
        } else if (!esDiaFeriado) {
          if (!usuario.fechaAsistencias.includes(dia.fecha)) {
            usuario.faltas += 1;
            usuario.fechaFaltas.push(dia.fecha)
          }
        } else if (esDiaFeriado) {
          // Registrar la asistencia si es día feriado
          usuario.asistencias += 1
          usuario.fechaAsistencias.push(dia.fecha)
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

export const obtenerFaltasContpaq = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, claveEmpresa, periodo} = req.body
    const diasEnRango = await obtenerDiasEnRango(fechaInicio, fechaFin)
    const usuarios = await procesarDatosContpaq(fechaInicio, fechaFin, diasEnRango, claveEmpresa, periodo)
    return res.json(usuarios)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

const procesarDatosContpaq = async (fechaInicio, fechaFin, diasEnRango, claveEmpresa, periodo) => {
  try {
    const [todoschecks, todosSolicitudes, todosIncapacidades, turnosEspeciales, empresa, diasFeriados] = await Promise.all([
      db.query(queryChecksEmpresa(fechaInicio, fechaFin, claveEmpresa), { type: QueryTypes.SELECT }),
      db.query(querySolicitudesJustificantesEmpresa(fechaInicio, fechaFin, claveEmpresa), { type: QueryTypes.SELECT }),
      db.query(queryIncapacidadesEmpresa(fechaInicio, fechaFin, claveEmpresa), { type: QueryTypes.SELECT }),
      CatalogoTurnos.findAll({ where: { turnoEspecial: 1 } }),
      Empresas.findOne({where:{ claveEmpresa }}),
      DiasFeriados.findAll({where: {fecha: {[Op.between]: [fechaInicio, fechaFin],},},})
    ]);
    
    const usuarios = await db.query(queryidUsuariosContpaq(claveEmpresa, empresa.bdContpaq), { type: QueryTypes.SELECT })
    const usuariosMap = new Map()

    // Procesar los checks
    todoschecks.forEach(check => {
      if (!usuariosMap.has(check.numero_empleado)) {
        usuariosMap.set(check.numero_empleado, {
          numero_empleado: check.numero_empleado,
          idempleado: usuarios.find(user => parseInt(user.codigoempleado) === check.numero_empleado).idempleado,
          baseDatos: usuarios.find(user => parseInt(user.codigoempleado) === check.numero_empleado).bd,
          nombre: check.nombre,
          puesto: check.puesto,
          claveEmpresa: check.claveEmpresa,
          claveSucursal: check.claveSucursal,
          fechaFaltas: [],
          fechasProcesadas: new Set(),
          turnoLunesViernes: check.turnoLunesViernes,
          turnoSabados: check.turnoSabados
        })
      }

      const usuario = usuariosMap.get(check.numero_empleado)
      const fechaRegistro = check.fechaRegistro

      if (fechaRegistro) {
        usuario.fechasProcesadas.add(fechaRegistro)
      }
    });

    // Procesar las solicitudes
    todosSolicitudes.forEach(solicitud => {
      const usuarioId = solicitud.numero_empleado
      const fechaSolicitud = solicitud.fechaDiaSolicitado

      if (!usuariosMap.has(usuarioId)) {
        usuariosMap.set(usuarioId, {
          numero_empleado: solicitud.numero_empleado,
          idempleado: usuarios.find(user => parseInt(user.codigoempleado) === solicitud.numero_empleado).idempleado,
          baseDatos: usuarios.find(user => parseInt(user.codigoempleado) === solicitud.numero_empleado).bd,
          nombre: solicitud.nombre,
          puesto: solicitud.puesto,
          claveEmpresa: solicitud.claveEmpresa,
          claveSucursal: solicitud.claveSucursal,
          fechaFaltas: [],
          fechasProcesadas: new Set(),
          turnoLunesViernes: solicitud.turnoLunesViernes,
          turnoSabados: solicitud.turnoSabados
        })
      }

      const usuario = usuariosMap.get(usuarioId)

      if (fechaSolicitud) {
        usuario.fechasProcesadas.add(fechaSolicitud)
      }
    })

    // Procesar las incapacidades
    todosIncapacidades.forEach(incapacidad => {
      const usuarioId = incapacidad.numero_empleado
      const fechaIncapacidad = incapacidad.fechaIncapacidad

      if (!usuariosMap.has(usuarioId)) {
        usuariosMap.set(usuarioId, {
          numero_empleado: incapacidad.numero_empleado,
          idempleado: usuarios.find(user => parseInt(user.codigoempleado) === incapacidad.numero_empleado).idempleado,
          baseDatos: usuarios.find(user => parseInt(user.codigoempleado) === incapacidad.numero_empleado).bd,
          nombre: incapacidad.nombre,
          puesto: incapacidad.puesto,
          claveEmpresa: incapacidad.claveEmpresa,
          claveSucursal: incapacidad.claveSucursal,
          fechaFaltas: [],
          fechasProcesadas: new Set(),
          turnoLunesViernes: incapacidad.turnoLunesViernes,
          turnoSabados: incapacidad.turnoSabados
        })
      }

      const usuario = usuariosMap.get(usuarioId)

      if (fechaIncapacidad) {
        usuario.fechasProcesadas.add(fechaIncapacidad)
      }
    })

    // Agregar las fechas de faltas y manejar turnos especiales
    const resultados = []

    usuariosMap.forEach(usuario => {
      const tieneTurnoEspecialSemana = turnosEspeciales.some(turno => turno.turno === usuario.turnoLunesViernes)
      const tieneTurnoEspecialSabado = turnosEspeciales.some(turno => turno.turno === usuario.turnoSabados)

      diasEnRango.forEach(dia => {
        const esSabado = dayjs(dia.fecha).day() === 6
        const esDiaFeriado = diasFeriados.some((feriado) => feriado.fecha === dia.fecha)

        // Solo considerar como falta si no es un día con turno especial
        const esDiaConTurnoEspecial = (esSabado && tieneTurnoEspecialSabado) || (!esSabado && tieneTurnoEspecialSemana)

        if (!esDiaConTurnoEspecial && !usuario.fechasProcesadas.has(dia.fecha) && !esDiaFeriado) {
          resultados.push({
            numero_empleado: usuario.numero_empleado,
            idempleado: usuarios.find(user => parseInt(user.codigoempleado) === usuario.numero_empleado).idempleado,
            baseDatos: usuarios.find(user => parseInt(user.codigoempleado) === usuario.numero_empleado).bd,
            nombre: usuario.nombre,
            puesto: usuario.puesto,
            claveEmpresa: usuario.claveEmpresa,
            claveSucursal: usuario.claveSucursal,
            idperiodo: periodo,
            idtipoincidencia: 15,
            idtarjetaincapacidad: 0,
            idtcontrolvacaciones: 0,
            valor: 1,
            fecha: formatDateTime(dia.fecha),
            fechaFalta: dia.fecha
          })
        }
      })
    })

    return resultados
  } catch (error) {
    throw error
  }
}

const formatDateTime = (fecha) => {
  const date = new Date(fecha)
  
  // Obtener partes de la fecha
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1 // Los meses empiezan en 0, por eso se suma 1
  let day = date.getUTCDate()
  
  // Lógica para ajustar el día
  if (day >= 1 && day <= 15) {
    day = day + 15 // Si el día está entre 1 y 15, suma 15 días
  } else if (day >= 16) {
    const siguienteMes = month + 1 > 12 ? 1 : month + 1
    const siguienteAnio = month + 1 > 12 ? year + 1 : year

    if (day === 31) {
      day = 15 // Si el día es 31, debe ser 15 del siguiente mes
    } else {
      day = day - 15 // Si el día está entre 16 y 30, resta 15 días
    }

    // Actualizar mes y año si es necesario
    date.setUTCFullYear(siguienteAnio)
    date.setUTCMonth(siguienteMes - 1) // Restamos 1 porque los meses empiezan en 0
  }

  // Siempre establecer las horas, minutos y segundos en "00:00:00"
  const hours = '00'
  const minutes = '00'
  const seconds = '00'

  // Ajustar partes de la fecha al formato deseado
  const formattedMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
  const formattedDay = String(day).padStart(2, '0')

  return `${date.getUTCFullYear()}-${formattedMonth}-${formattedDay} ${hours}:${minutes}:${seconds}`
}
